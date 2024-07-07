

module.exports = mongoose => {
    const loginTokenModel = mongoose.model(
      "loginTokenModel",
      mongoose.Schema(
        {
            email: String,
            token: {
              type: String,
              unique: true 
            },
            
            createdAt: {type: Date, default:Date.now}//, expires: 3600}
            
            
        },
        { timestamps: true }
      )
    );
    return loginTokenModel;
  };
