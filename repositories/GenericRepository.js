class GenericRepository {
  constructor(model) {
    this.model = model;
  }
  async findAll(options = {}) {
    return await this.model.findAll(options);
  }
  async findOne(options = {}) {
    return await this.model.findOne(options);
  }
  async create(data) {
    return await this.model.create(data);
  }
  async update(id, data) {
    const instance = await this.model.findByPk(id);
    if (!instance) return null;
    return await instance.update(data);
  }
  async delete(id) {
    const instance = await this.model.findByPk(id);
    if (!instance) return null;
    await instance.destroy();
    return true;
  }
}

export default GenericRepository;
