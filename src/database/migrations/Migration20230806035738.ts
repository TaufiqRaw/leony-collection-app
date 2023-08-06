import { Migration } from '@mikro-orm/migrations';

export class Migration20230806035738 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "production_type" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "salary" int not null, "name" varchar(255) not null);');
    this.addSql('alter table "production_type" add constraint "production_type_name_unique" unique ("name");');

    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "password" varchar(255) not null, "is_admin" boolean not null, "profile_picture" varchar(255) null);');
    this.addSql('create index "user_name_index" on "user" ("name");');

    this.addSql('create table "production_log" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" int not null, "amount" int not null, "type_id" int null);');

    this.addSql('alter table "production_log" add constraint "production_log_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "production_log" add constraint "production_log_type_id_foreign" foreign key ("type_id") references "production_type" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "production_log" drop constraint "production_log_type_id_foreign";');

    this.addSql('alter table "production_log" drop constraint "production_log_user_id_foreign";');

    this.addSql('drop table if exists "production_type" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "production_log" cascade;');
  }

}
