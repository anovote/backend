import { Connection } from "typeorm";
import {ElectionOrganizerModel} from "@/models/ElectionOrganizerModel";
import {ElectionOrganizer} from "@/models/entity/ElectionOrganizer";
import {validate} from "class-validator";
import {EncryptionService} from "@/services/EncryptionService";

export class ElectionOrganizerService {
    private database: Connection;
    private encryptionService: EncryptionService;

    constructor(database: Connection) {
        this.database = database;
        this.encryptionService = new EncryptionService();
    }

    public async create(electionOrganizerModel: ElectionOrganizerModel): Promise<number> {
        const electionOrganizer = new ElectionOrganizer();
        electionOrganizer.firstName = electionOrganizerModel.firstName;
        electionOrganizer.lastName = electionOrganizerModel.lastName;
        electionOrganizer.email = electionOrganizerModel.email;
        electionOrganizer.password = electionOrganizerModel.password;

        const errors = await validate(electionOrganizer);
        if (errors.length > 0) {
            throw new Error("Validation failed!")
        } else {
            electionOrganizer.password = await this.encryptionService.hash(electionOrganizer.password);
            const save = await this.database.getRepository(ElectionOrganizer).save(electionOrganizer);
            return save.id;
        }
    }
}