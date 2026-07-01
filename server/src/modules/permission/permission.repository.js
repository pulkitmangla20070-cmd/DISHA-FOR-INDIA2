const Permission = require('./permission.model');

class PermissionRepository {
  async create(permissionData) {
    return Permission.create(permissionData);
  }

  async findByCode(code) {
    return Permission.findOne({ code, isSystemPermission: true }).or([{ isDeleted: { $ne: true } }, { isDeleted: false }]);
  }

  async findAll(query = {}) {
    const { page = 1, limit = 50, module, category } = query;
    const skip = (page - 1) * limit;
    const filter = {};

    if (module) {
      filter.module = module;
    }
    if (category) {
      filter.category = category;
    }

    const [permissions, total] = await Promise.all([
      Permission.find(filter).skip(skip).limit(limit).lean(),
      Permission.countDocuments(filter),
    ]);

    return { permissions, total, page, limit };
  }

  async findById(id) {
    return Permission.findById(id);
  }

  async existsByCode(code) {
    return Permission.findOne({ code });
  }
}

module.exports = new PermissionRepository();