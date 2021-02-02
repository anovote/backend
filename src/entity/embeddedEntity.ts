import { Column, CreateDateColumn } from "../deps.ts";

export class Name {
  @Column({ type: String })
  firstName!: string;

  @Column({ type: String })
  lastName!: string;
}

export class CreationUpdateDate {
  @CreateDateColumn()
  createdAt!: Date;
  @CreateDateColumn()
  updatedAt!: Date;
}
