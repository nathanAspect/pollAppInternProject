import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddNominationData,
  AddParticipantData,
  AddParticipantRankingsData,
  CreatePollData,
} from './types';
import { Poll, Results } from '../shared';

@Injectable()
export class PollsRepository {
  private readonly logger = new Logger(PollsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  private mapToRedisStyle(poll: any): Poll {
    const participants: Record<string, string> = {};
    poll.participants.forEach((p) => (participants[p.userID] = p.name));

    const nominations: Record<string, any> = {};
    poll.nominations.forEach((n) => (nominations[n.id] = { text: n.text }));

    const rankings: Record<string, string[]> = {};
    poll.rankings.forEach((r) => {
      if (!rankings[r.userID]) rankings[r.userID] = [];
      rankings[r.userID].push(String(r.ranking));
    });

    const results = poll.results.map((r) => r.result);

    return {
      id: poll.id,
      topic: poll.topic,
      votesPerVoter: poll.votesPerVoter,
      adminID: poll.adminID,
      hasStarted: poll.hasStarted,
      participants,
      nominations,
      rankings,
      results,
    };
  }

  async createPoll({ votesPerVoter, topic, pollID, userID }: CreatePollData): Promise<Poll> {
    this.logger.log(`Creating new poll: ${pollID}`);
    try {
      const poll = await this.prisma.poll.create({
        data: {
          id: pollID,
          topic,
          votesPerVoter,
          adminID: userID,
          hasStarted: false,
        },
        include: { participants: true, nominations: true, rankings: true, results: true },
      });

      return this.mapToRedisStyle(poll);
    } catch (e) {
      this.logger.error(`Failed to create poll ${pollID}`, e);
      throw new InternalServerErrorException();
    }
  }

  async getPoll(pollID: string): Promise<Poll | null> {
  this.logger.log(`Fetching poll: ${pollID}`);
  try {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollID },
      include: { participants: true, nominations: true, rankings: true, results: true },
    });

    if (!poll) {
      this.logger.warn(`Poll not found: ${pollID}`);
      return null;
    }

    return this.mapToRedisStyle(poll);
  } catch (e) {
    this.logger.error(`Failed to fetch poll ${pollID}`, e);
    return null;
  }
  }


  async addParticipant({ pollID, userID, name }: AddParticipantData): Promise<Poll | null> {
    this.logger.log(`Adding participant ${userID} to poll ${pollID}`);

    const poll = await this.prisma.poll.findUnique({
      where: { id: pollID },
      include: { participants: true, nominations: true, rankings: true, results: true },
    });

    if (!poll) {
      this.logger.warn(`Poll ${pollID} not found. Cannot add participant ${userID}`);
      return null;
    }

    try {
      await this.prisma.pollParticipant.create({
        data: { pollId: pollID, userID, name },
      });

      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to add participant ${userID}`, e);
      throw new InternalServerErrorException();
    }
  }


  async removeParticipant(pollID: string, userID: string): Promise<Poll> {
    this.logger.log(`Removing participant ${userID} from poll ${pollID}`);
    try {
      await this.prisma.pollParticipant.deleteMany({
        where: { pollId: pollID, userID },
      });
      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to remove participant ${userID}`, e);
      throw new InternalServerErrorException();
    }
  }

  async addNomination({ pollID, nominationID, nomination }: AddNominationData): Promise<Poll> {
    this.logger.log(`Adding nomination ${nominationID} to poll ${pollID}`);
    try {
      await this.prisma.nomination.create({
        data: { id: nominationID, pollId: pollID, text: nomination.text },
      });
      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to add nomination ${nominationID}`, e);
      throw new InternalServerErrorException();
    }
  }

  async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
    this.logger.log(`Removing nomination ${nominationID} from poll ${pollID}`);
    try {
      await this.prisma.nomination.deleteMany({
        where: { pollId: pollID, id: nominationID },
      });
      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to remove nomination ${nominationID}`, e);
      throw new InternalServerErrorException();
    }
  }

  async startPoll(pollID: string): Promise<Poll> {
    this.logger.log(`Starting poll ${pollID}`);
    try {
      await this.prisma.poll.update({
        where: { id: pollID },
        data: { hasStarted: true },
      });
      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to start poll ${pollID}`, e);
      throw new InternalServerErrorException();
    }
  }

  async addParticipantRankings({ pollID, userID, rankings }: AddParticipantRankingsData): Promise<Poll> {
    this.logger.log(`Adding rankings for ${userID} in poll ${pollID}`);
    try {
      for (const ranking of rankings) {
        await this.prisma.pollRanking.create({
          data: { pollId: pollID, userID, ranking },
        });
      }
      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to add rankings for ${userID}`, e);
      throw new InternalServerErrorException();
    }
  }

  async addResults(pollID: string, results: Results): Promise<Poll> {
    this.logger.log(`Adding results for poll ${pollID}`);
    try {
      await this.prisma.pollResult.create({
        data: { pollId: pollID, result: results },
      });
      return this.getPoll(pollID);
    } catch (e) {
      this.logger.error(`Failed to add results for poll ${pollID}`, e);
      throw new InternalServerErrorException();
    }
  }

  async deletePoll(pollID: string): Promise<void> {
    this.logger.log(`Deleting poll ${pollID}`);
    try {
      await this.prisma.poll.delete({
        where: { id: pollID },
      });
    } catch (e) {
      this.logger.error(`Failed to delete poll ${pollID}`, e);
      throw new InternalServerErrorException();
    }
  }
}
