-- DropForeignKey
ALTER TABLE "public"."Nomination" DROP CONSTRAINT "Nomination_pollId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PollParticipant" DROP CONSTRAINT "PollParticipant_pollId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PollRanking" DROP CONSTRAINT "PollRanking_pollId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PollResult" DROP CONSTRAINT "PollResult_pollId_fkey";

-- AddForeignKey
ALTER TABLE "public"."PollParticipant" ADD CONSTRAINT "PollParticipant_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "public"."Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Nomination" ADD CONSTRAINT "Nomination_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "public"."Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PollRanking" ADD CONSTRAINT "PollRanking_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "public"."Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PollResult" ADD CONSTRAINT "PollResult_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "public"."Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
