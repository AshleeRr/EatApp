import context from "../../config/context/AppContext.js";
import GenericRepository from "../GenericRepository.js";

class StoresTypesRepository extends GenericRepository {
  constructor() {
    super(context.TipoComercio);
  }
}

export default new StoresTypesRepository();
