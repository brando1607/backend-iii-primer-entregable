export class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async getAll() {
    return await this.dao.getAll();
  }
  async getById({ userId }) {
    return await this.dao.getById({ userId });
  }
  async update(product) {
    return await this.dao.update(product);
  }
  async delete({ userId }) {
    return await this.dao.delete({ userId });
  }
}
