import context from "../../config/context/AppContext.js";
import GenericRepository from "../GenericRepository.js";

//handlers
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

class AdminRepository extends GenericRepository {
  constructor() {
    super(context.Admin);
  }
  getAllAdmins = HandRepositoriesAsync(async () => {
    return await super.findAll({
      attributes: [
        "id",
        "nombre",
        "apellido",
        "usuario",
        "cedula",
        "correo",
        "userId",
      ],
      order: [["id", "ASC"]],
    });
  });
  getAdminById = HandRepositoriesAsync(async (id) => {
    return await super.findOne(id, {
      attributes: [
        "id",
        "nombre",
        "apellido",
        "usuario",
        "cedula",
        "correo",
        "userId",
      ],
    });
  });
  createAdmin = HandRepositoriesAsync(async (data) => {
    if (!data) {
      HandError(400, "Los datos no pueden estar vacíos");
    }
    const requiredFields = [
      "nombre",
      "apellido",
      "usuario",
      "cedula",
      "correo",
      "userId",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        HandError(400, `El campo ${field} es obligatorio`);
      }
    }
    return await super.create(data);
  });
  updateAdmin = HandRepositoriesAsync(async (id, data) => {
    return await super.update(id, data);
  });
  deleteAdmin = HandRepositoriesAsync(async (id) => {
    const admin = await this.getAdminById(id);
    if (!admin) {
      HandError(404, "Administrador no encontrado");
    }
    return await super.delete(id);
  });
}

export default new AdminRepository();
