import { Connection } from "typeorm";
import {ElectionOrganizerModel} from "@/models/ElectionOrganizerModel";
import {ElectionOrganizer} from "@/models/entity/ElectionOrganizer";
import {validate} from "class-validator";

export class ElectionOrganizerService {
    private database: Connection;

    constructor(database: Connection) {
        this.database = database;
    }

    public async create(electionOrganizerModel: ElectionOrganizerModel) {
        const electionOrganizer = new ElectionOrganizer();
        electionOrganizer.firstName = electionOrganizerModel.firstName;
        electionOrganizer.lastName = electionOrganizerModel.lastName;
        electionOrganizer.email = electionOrganizerModel.email;
        electionOrganizer.password = electionOrganizerModel.password;

        const errors = await validate(electionOrganizer);
        if (errors.length > 0) {
            throw new Error("Validation failed!")
        } else {
            this.database.getRepository(ElectionOrganizer).save(electionOrganizer);
        }
    }
}