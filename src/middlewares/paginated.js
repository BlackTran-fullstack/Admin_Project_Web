function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const sortBy = req.query.sortBy || "_id";
        const order = req.query.order === "desc" ? -1 : 1;

        const search = req.query.search || "";
        const searchFields = req.query.fields 
            ? req.query.fields.split(",")
            : ["name", "email"];

        const query = searchFields.length 
            ? {
                  $or: searchFields.map((field) => ({
                      [field]: { $regex: search, $options: "i" },
                  })),
              }
            : {};

        try {
            const totalDocuments = await model.countDocuments(query).exec();

            const totalPages = Math.ceil(totalDocuments / limit);

            const results = await model
                .find(query)
                .sort({ [sortBy]: order })
                .limit(limit)
                .skip((page - 1) * limit)
                .exec();

            res.paginatedResults = {
                data: results,
                totalDocuments,
                page,
                totalPages,
                limit,
            };
            next();
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
}

module.exports = paginatedResults;
