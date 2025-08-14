-- CreateTable
CREATE TABLE "public"."Poll" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "votesPerVoter" INTEGER NOT NULL,
    "hasStarted" BOOLEAN NOT NULL DEFAULT false,
    "adminID" TEXT NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PollParticipant" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PollParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Nomination" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Nomination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PollRanking" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "ranking" INTEGER NOT NULL,

    CONSTRAINT "PollRanking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PollResult" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "result" JSONB NOT NULL,

    CONSTRAINT "PollResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PollParticipant" ADD CONSTRAINT "PollParticipant_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "public"."Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Nomination" ADD CONSTRAINT "Nomination_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "public"."Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PollRanking" ADD CONSTRAINT "PollRanking_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "public"."Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PollResult" ADD CONSTRAINT "PollResult_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "public"."Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
