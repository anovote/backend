import { EntityManager } from "https://denolib.com/denolib/typeorm@v0.2.23-rc10/src/entity-manager/EntityManager.ts";
import {
  getManager,
  getRepository,
} from "https://denolib.com/denolib/typeorm@v0.2.23-rc10/src/index.ts";
import { Response } from "https://deno.land/x/oak@v6.5.0/response.ts";
import { Request } from "https://deno.land/x/oak@v6.5.0/request.ts";
// import { getRepository } from "https://denolib.com/denolib/typeorm@v0.2.23-rc10/src/index.ts";

import { Election } from "../models/Election.ts";
import { titleCase } from "https://denolib.com/denolib/typeorm@v0.2.23-rc10/src/util/StringUtils.ts";
import { optional } from "https://denoporter.sirjosh.workers.dev/v1/deno.land/x/computed_types/src/schema/logic.ts";
import { RouteParams } from "https://deno.land/x/oak@v6.5.0/router.ts";

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
        succsess: true,
        data: election,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async updateElectionById(
    { request, response }: { request: Request; response: Response },
  ) {
    console.log("here");

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
    console.log("inside request");

    const requestBody = request.body({ type: "json" });

    const values = await requestBody.value;
    const { id, title, description } = values;

    const election: Election = new Election();
    if (id) {
      election.id = id;
    }
    election.title = title;
    election.description = description;
    console.log(election);
    return election;
  }
}

// import { Election } from "../models/Election.ts";
// import {} from "../deps.ts";
// import { Response } from "https://deno.land/x/oak@v6.5.0/response.ts";
// import { Request } from "https://deno.land/x/oak@v6.5.0/request.ts";

// export default {
//   /**
//    * TODO: add comment
//    */
//   getAllElections: getAllElections,
//   createElection: createElection,
//   getElectionById: () => {},
//   updateElectionById: () => {},
//   deleteElectionById: () => {},
// };

// function getAllElections(
//   { response }: { response: Response },
// ) {
//   await Election.get;
//   response.status = 200;
//   response.body = {
//     success: true,
//     data: elections,
//   };
// }

// async function createElection(
//   { request, response }: {
//     request: Request;
//     response: Response;
//   },
// ) {
//   console.log("Create user");

//   if (!request.hasBody) {
//     response.status = 400;
//     response.body = {
//       success: false,
//       msg: "No data",
//     };
//     return;
//   }

//   const electionData = await request.body().value as Election;
//   console.log(electionData);

//   const [error, election] = validator(electionData);
//   console.log(election);

//   console.log(error?.message);

//   // validateElectionData(electionData);
// }

// function getElectionById({ response }: { response: any }) {
// }
