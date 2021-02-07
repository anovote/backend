import { Connection } from "typeorm";
import {ElectionOrganizerModel} from "@/models/ElectionOrganizerModel";
import {ElectionOrganizer} from "@/models/entity/ElectionOrganizer";

export class ElectionOrganizerService {
    private database: Connection;

    constructor(database: Connection) {
        this.database = database;
    }

    public create(electionOrganizerModel: ElectionOrganizerModel) {
        const electionOrganizer = new ElectionOrganizer();
        electionOrganizer.firstName = electionOrganizerModel.firstName;
        electionOrganizer.lastName = electionOrganizerModel.lastName;
        electionOrganizer.email = electionOrganizerModel.email;
        electionOrganizer.password = electionOrganizerModel.password;

        this.database.getRepository(ElectionOrganizer).save(electionOrganizer);
    }
}