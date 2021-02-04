import { getRepository, Request, Response, RouteParams } from "../deps.ts";

import { Election, ElectionStatus } from "../models/Election.ts";

export default class ElectionController {
  async getAllElections({ response }: { response: Response }) {
    try {
      const elections: Election[] | undefined = await getRepository(Election)
        .find();

      response.status = 200;
      response.body = {
        success: true,
        data: elections,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async createElection(
    { request, response }: { request: Request; response: Response },
  ) {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        errorMessage: "No data",
      };
      return;
    }

    try {
      const election = await this.getElectionFromRequest(request);
      await getRepository(Election).save(election);

      response.status = 201;
      response.body = {
        success: true,
        data: election,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async updateElectionById(
    { request, response }: { request: Request; response: Response },
  ) {
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        errorMessage: "No data",
      };
      return;
    }

    const election = await this.getElectionFromRequest(request);

    await getRepository(Election).update(election.id, election);

    response.status = 201;
    response.body = {
      success: true,
      data: election,
    };
  }

  async deleteElectionById(
    { request, response, params }: {
      request: Request;
      response: Response;
      params: RouteParams;
    },
  ) {
    const id = params.id;

    if (!id) {
      response.status = 400;
      response.body = {
        success: false,
        errorMessage: `ID not found`,
      };
      return;
    }

    const election = await getRepository(Election).findOneOrFail(id);
    if (!election) {
      response.status = 400;
      response.body = {
        success: false,
        errorMessage: `Election with id:${id} not found`,
      };
      return;
    }

    await getRepository(Election).remove(election);

    response.status = 200;
    response.body = {
      success: true,
      message: `Election with id:"${id}" was removed`,
    };
  }

  async getElectionFromRequest(request: Request): Promise<Election> {
    const requestBody = request.body({ type: "json" });

    const values = await requestBody.value;
    let { id, title, description, password, status } = values;

    const election: Election = new Election();
    if (id) {
      election.id = id;
    }
    election.title = title;
    election.description = description;
    if (!password) {
      password = null;
    }
    election.password = password;
    election.status = status;

    console.log(election);
    return election;
  }
}
