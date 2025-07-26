import { DataTypes, Model } from "sequelize";
import { db } from "../db"

class TempBan extends Model {
    declare id: number;
    declare guildId: string;
    declare userId: string;
    declare unbanDate: Date;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

TempBan.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guildId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unbanDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: "tempbans",
    sequelize: db
})

TempBan.sync()

export default TempBan;