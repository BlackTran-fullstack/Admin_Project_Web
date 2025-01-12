function paginatedResults(model) {
    return async (req, res, next) => {

        console.log("model.modelName: ", model.modelName);
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
<<<<<<< HEAD
        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order === "desc" ? -1 : 1;
=======
        const sortBy = req.query.sortBy || "_id";
        const order = req.query.order === "desc" ? -1 : 1;  
>>>>>>> origin/uploadImage

        const search = req.query.search || "";

        const filter = req.query.filter || "";

        // Lọc theo category và brand
        const categoryFilter = req.query.category || "";
        const brandFilter = req.query.brand || "";
        
        console.log("categoryFilter: ", categoryFilter);
        console.log("brandFilter: ", brandFilter);

        const searchFields = req.query.fields 
            ? req.query.fields.split(",")
            : ["firstName", "lastName", "email"];

        const keywords = search.split(" ").filter((word) => word.trim() !== "");

        const query = {
            $and: keywords.map((keyword) => ({
                $or: searchFields.map((field) => ({
                    [field]: { $regex: keyword, $options: "i" },
                })),
            })),
        };


        // Thêm điều kiện lọc Category và Brand nếu có
        if (categoryFilter) {
            query["categoriesId"] = categoryFilter;
        }
        
        if (brandFilter) {
            query["brandsId"] = brandFilter;
        }

        try {
            const totalDocuments = await model.countDocuments(query).exec();

            const totalPages = Math.ceil(totalDocuments / limit);

            // const results = await model
            //     .find(query)
                
            //     .sort({ [sortBy]: order })
            //     .limit(limit)
            //     .skip((page - 1) * limit)
            //     .exec();


            let results = model.find(query).sort({ [sortBy]: order }).limit(limit).skip((page - 1) * limit);

            // Only populate "categoriesId" if it's a Product model
            if (model.modelName === "Products") {
                results = results.populate("categoriesId", "name");
                results = results.populate("brandsId", "name");
            }

            // Execute the query
            const populatedResults = await results.exec();


            res.paginatedResults = {
                //data: results,
                data: populatedResults,
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
