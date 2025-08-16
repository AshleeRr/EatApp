import context from "../../config/context/AppContext.js";
import GenericRepository from "../GenericRepository.js";

//handlers
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

class AdminRepository extends GenericRepository {
  constructor() {
    super(context.User);
  }
  getAllAdmins = HandRepositoriesAsync(async () => {
    return await super.findAll({
      where: { role: "admin" },
      attributes: ["id", "userName", "email", "role", "isActive"],
      order: [["createdAt", "DESC"]],
    });
  });
  getAdminById = HandRepositoriesAsync(async (id) => {
    return await super.findOne(id, {
      where: { role: "admin" },
      attributes: ["id", "userName", "email", "role", "isActive"],
    });
  });
  createAdmin = HandRepositoriesAsync(async (data) => {
    if (!data) {
      HandError(400, "Los datos no pueden estar vacíos");
    }

    if (!data.role) {
      data.role = "admin";
    }

    return await super.create(data);
  });
  updateAdmin = HandRepositoriesAsync(async (id, data) => {
    return await super.update(data, {
      where: { id, role: "admin", isActive: true },
    });
  });
  deleteAdmin = HandRepositoriesAsync(async (id) => {
    const admin = await this.getAdminById(id);
    if (!admin) {
      HandError(404, "Administrador no encontrado");
    }
    if (admin.role !== "admin") {
      HandError(403, "No tienes permiso para eliminar este administrador");
    }
    if (!admin.isActive) {
      HandError(400, "El administrador ya está inactivo");
    }
    return await super.delete(id);
  });
}

export default new AdminRepository();
