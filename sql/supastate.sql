CREATE SCHEMA "s1";
CREATE TABLE "s1"."t1_col" ();
ALTER TABLE "s1"."t1_col" ADD "id" uuid;
ALTER TABLE "s1"."t1_col" ADD "user_id" uuid;
ALTER TABLE "s1"."t1_col" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "s1"."t1_col" ADD CONSTRAINT "t1_col_id_pkey" PRIMARY KEY ("id");
ALTER TABLE "s1"."t1_col" ADD CONSTRAINT "t1_col_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id");
