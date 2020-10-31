  import axios from "axios";
  const { toXML } = require("jstoxml");

  import HttpError from "../utils/HttpError";
  import { BlingRequest, BlingReturn } from "../interfaces/BlingInterface";
  import { Deal } from "../interfaces/PipedriveInterface";

  class BlingService {
    private apiBling = axios.create({
      baseURL: process.env.BLING_URL,
    });

    castOrder(deal: Deal) {
      this.createRequest({
        clientName: deal.person_name,
        code: deal.id,
        description: deal.title,
        value: deal.value,
      });
    }

    async createRequest(request: BlingRequest) {
      const xml = this.getBlingRequestBody(request);

      const { data, status } = await this.apiBling.post<BlingReturn>("/", null, {
        params: {
          apikey: process.env.BLING_KEY,
          xml,
        },
      });

      if (data.retorno.erros && data.retorno.erros.length) {
        throw new HttpError(400, data.retorno.erros[0].erro.msg);
      }

      if (status <= 199 || status >= 300) {
        throw new HttpError(500, "Error in Bling Api");
      }
    }

    getBlingRequestBody(request: BlingRequest) {
      return toXML({
        pedido: {
          cliente: {
            nome: request.clientName,
          },
          itens: {
            item: {
              codigo: request.code,
              descricao: request.description,
              vlr_unit: request.value,
              qtde: "1",
            },
          },
        },
      });
    }
  }

  export default new BlingService();
