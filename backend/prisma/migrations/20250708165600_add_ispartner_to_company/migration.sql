-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "razaoSocial" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "isPartner" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Company" ("cnpj", "createdAt", "email", "id", "name", "password", "razaoSocial", "updatedAt") SELECT "cnpj", "createdAt", "email", "id", "name", "password", "razaoSocial", "updatedAt" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");
CREATE UNIQUE INDEX "Company_cnpj_key" ON "Company"("cnpj");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
