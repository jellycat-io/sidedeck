-- CreateEnum
CREATE TYPE "FrameType" AS ENUM ('EFFECT', 'EFFECT_PENDULUM', 'FUSION', 'FUSION_PENDULUM', 'LINK', 'NORMAL', 'NORMAL_PENDULUM', 'RITUAL', 'RITUAL_PENDULUM', 'SPELL', 'SYNCHRO', 'SYNCHRO_PENDULUM', 'TOKEN', 'TRAP', 'XYZ', 'XYZ_PENDULUM');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('EFFECT_MONSTER', 'FLIP_EFFECT_MONSTER', 'FLIP_TUNER_EFFECT_MONSTER', 'FUSION_MONSTER', 'GEMINI_MONSTER', 'LINK_MONSTER', 'NORMAL_MONSTER', 'NORMAL_TUNER_MONSTER', 'PENDULUM_EFFECT_MONSTER', 'PENDULUM_EFFECT_FUSION_MONSTER', 'PENDULUM_EFFECT_RITUAL_MONSTER', 'PENDULUM_FLIP_EFFECT_MONSTER', 'PENDULUM_NORMAL_MONSTER', 'PENDULUM_TUNER_EFFECT_MONSTER', 'RITUAL_EFFECT_MONSTER', 'RITUAL_MONSTER', 'SPELL_CARD', 'SPIRIT_MONSTER', 'SYNCHRO_MONSTER', 'SYNCHRO_PENDULUM_EFFECT_MONSTER', 'SYNCHRO_TUNER_MONSTER', 'TOON_MONSTER', 'TOKEN', 'TRAP_CARD', 'TUNER_MONSTER', 'UNION_EFFECT_MONSTER', 'XYZ_MONSTER', 'XYZ_PENDULUM_EFFECT_MONSTER');

-- CreateEnum
CREATE TYPE "LinkMarker" AS ENUM ('BOTTOM_LEFT', 'BOTTOM_RIGHT', 'BOTTOM', 'LEFT', 'RIGHT', 'TOP_LEFT', 'TOP_RIGHT', 'TOP');

-- CreateEnum
CREATE TYPE "MonsterAttribute" AS ENUM ('DARK', 'DIVINE', 'EARTH', 'FIRE', 'LIGHT', 'WATER', 'WIND');

-- CreateEnum
CREATE TYPE "CardRace" AS ENUM ('AQUA', 'BEAST', 'BEAST_WARRIOR', 'CONTINUOUS', 'COUNTER', 'CREATOR_GOD', 'CYBERSE', 'DINOSAUR', 'DIVINE_BEAST', 'DRAGON', 'DR_VELLIAN_C', 'EQUIP', 'FAIRY', 'FIEND', 'FIELD', 'FISH', 'ILLUSION', 'INSECT', 'MACHINE', 'NORMAL', 'PLANT', 'PSYCHIC', 'PYRO', 'QUICK_PLAY', 'REPTILE', 'RITUAL', 'ROCK', 'SEA_SERPENT', 'SPELLCASTER', 'THUNDER', 'WARRIOR', 'WINGED_BEAST', 'WYRM', 'ZOMBIE');

-- CreateTable
CREATE TABLE "Card" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CardType" NOT NULL,
    "frameType" "FrameType" NOT NULL,
    "desc" TEXT NOT NULL,
    "atk" INTEGER,
    "def" INTEGER,
    "level" INTEGER,
    "scale" INTEGER,
    "linkval" INTEGER,
    "linkmarkers" "LinkMarker"[],
    "race" "CardRace",
    "attribute" "MonsterAttribute",
    "archetype" TEXT,
    "image_url" TEXT NOT NULL,
    "card_sets" JSONB[],
    "card_prices" JSONB[],
    "banlist_info" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "konami_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_konami_id_key" ON "User"("konami_id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_token_key" ON "VerificationToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_email_token_key" ON "PasswordResetToken"("email", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
