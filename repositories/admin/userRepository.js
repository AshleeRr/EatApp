import context from "../../config/context/AppContext.js";
import GenericRepository from "../GenericRepository.js";
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";
import { where } from "sequelize";
// import HandError from "../../utils/handlers/handlerError.js";
// const { User } = context;
// const UserRepo = new GenericRepository(User);

class UserRepository extends GenericRepository {
  constructor() {
    super(context.User);
  }

  GetUserByRole = HandRepositoriesAsync(async (role) => {
    const users = await super.findAll({ where: { role } });

    if (!users || users.length === 0) return false;

    return users;
  });

  GetUsersByRoleWithStatus = HandRepositoriesAsync(async (role) => {
    const activeUsers = await super.findAll({
      where: { role, isActive: true },
    });
    const inactiveUsers = await super.findAll({
      where: { role, isActive: false },
    });

    return { activeUsers, inactiveUsers };
  });

  GetUserDirections = HandRepositoriesAsync(async (idUser) => {
    const direcciones = await context.Direccion.findOne({
      where: { idUsuario: idUser },
    });

    if (!direcciones) return false;

    return direcciones;
  });
}

export default new UserRepository();
