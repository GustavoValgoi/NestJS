import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertRootInUser1688760084907 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      INSERT INTO public."user"(
        name, email, cpf, type_user, phone, password)
        VALUES ('root', 'root@root.com', '12345678901', 2, '31925325252', '$2b$10$r0YRAgtHZbYv11g.TGDvzeRhYj1cEdEdFpwLmgGzjiDPO01Z8yT6O');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      DELETE FROM public."user"
          WHERE email like 'root@root.com';
    `);
  }
}
