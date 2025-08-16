import context from "../../config/context/AppContext.js";
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";
import GenericRepository from "../GenericRepository.js";

class ConfigRepository extends GenericRepository {
  constructor() {
    super(context.Configuracion);
  }
  getItbis = HandRepositoriesAsync(async () => {
    const config = await super.findOne({ where: { key: "ITBIS" } });
    return config ? Number(config.value) : 0;
  });
}

export default new ConfigRepository();
