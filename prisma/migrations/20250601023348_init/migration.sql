-- CreateTable
CREATE TABLE "SequelizeMeta" (
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "data" JSON,
    "marketing_tracking_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_tracking" (
    "id" UUID NOT NULL,
    "hash" VARCHAR(8),
    "gclientid" VARCHAR(255),
    "gclid" VARCHAR(255),
    "fbclid" VARCHAR(255),
    "ga_utm" VARCHAR(255),
    "fbp" VARCHAR(255),
    "fbc" VARCHAR(255),
    "utm_content" VARCHAR(255),
    "utm_medium" VARCHAR(255),
    "utm_campaign" VARCHAR(255),
    "utm_source" VARCHAR(255),
    "utm_term" VARCHAR(255),
    "utm_referrer" VARCHAR(255),
    "referrer" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_lead_id_key" ON "leads"("lead_id");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_marketing_tracking_id_fkey" FOREIGN KEY ("marketing_tracking_id") REFERENCES "marketing_tracking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
