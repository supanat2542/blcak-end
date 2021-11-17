const Pool = require('pg').Pool;
const moment = require('moment');
const pool = new Pool({
    user: 'mable',
    host: 'mean.psu.ac.th',
    database: 'mable',
    password: 'zxc123**',
    port: '5432',
});

// --------------------------------------------------- Heruko -----------------------------------------------------------------------//
// const moment = require('moment');
// const Pool = require('pg').Pool;
// const pool = new Pool({
//     connectionString : process.env.DATABASE_URL = 'postgres://agbyrcsfpepycl:f966dbef63a39462ad3be17d9d4cfa17cfb82eb36c2dd9cf31bb120fc2c23580@ec2-54-160-35-196.compute-1.amazonaws.com:5432/deulokkuu2t01v',
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });

/****************************************************** GET API ALL TABLE *********************************************************/

/********************************* GET TABLE TAG **************************************/

const getTag = async(req, res) => {
    try {
        const result = await pool.query(`SELECT tag_id, tag_address FROM diis.tag`);
        output = {
            status: "success",
            result: result
        }
    } catch (error) {
        output = {
            status: "failed",
            shows: pool.connect,
            result: error
        }
    }
    res.json(output);
}

/********************************* GET TABLE TAGUSE ***********************************/

const getTaguse = async(req, res) => {
    try {
        const result = await pool.query(`SELECT taguse_id, tag_address, time_start, time_stop, visitor_id FROM diis.taguse order by time_stop desc `);
        output = {
            status: "success",
            result: result
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        }
    }
    res.json(output);
}
/********************************* GET Edit Person**********************************/

const getEdit = async(req, res) => {
    try {
        console.log(req.query)
        let tag_address = "NULL";
                tag_address = req.query.tag_address;
        const result = await pool.query(`SELECT visitor_id, first_name, last_name, tel, category, id_civiliz, contract, time_start, time_stop, tag_address
        FROM diis.visitor
        where tag_address = '${tag_address}' and time_stop is null ;
        `);
        output = {
            status: "success",
            result: result
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        }
    }
    res.json(output);
}
/********************************* GET Edit Object**********************************/

const getEditItem = async(req, res) => {
    try {
        console.log(req.query)
        let tag_address = "NULL";
                tag_address = req.query.tag_address;
        const result = await pool.query(`SELECT item_id, tool_name, "Owner", parcel_number, tool_person, detail, time_start, time_stop, tag_address
        FROM diis.items where tag_address = '${tag_address}' and time_stop is null ;
        `);
        output = {
            status: "success",
            result: result
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        }
    }
    res.json(output);
}

/********************************* GET TABLE SCANNER **********************************/

const getScanner = async(req, res) => {
    try {
        const result = await pool.query(`SELECT scanner_id, location_id, scanner_address, description FROM diis.scanner`);
        output = {
            status: "success",
            result: result
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        }
    }
    res.json(output);
}

/********************************* GET TABLE LOCATION *********************************/

const getLocation = async(req, res) => {
    try {
        const result = await pool.query(`SELECT location.location_id,scanner_address,room,floor  FROM diis."location" INNER JOIN diis."scanner" ON diis.location.location_id=diis.scanner.location_id;`);
        output = {
            status: "success",
            result: result
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        }
    }
    res.json(output);
}

/********************************* GET TABLE VISITOR **********************************/

const getVisitor = async(req, res) => {
    try {
        const result = await pool.query(`SELECT visitor_id, first_name, last_name, tel, category,id_civiliz,contract,time_start,time_stop,visitor.tag_address , tag_id
        FROM diis.visitor
        INNER join diis.tag 
        ON tag.tag_address = visitor.tag_address 
        order by time_stop desc
        `);
        output = {
            status: "success",
            result: result
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        }
    }
    res.json(output);
}

/********************************* GET TABLE getItem **********************************/

const getItem = async(req, res) => {
    try {
        const result = await pool.query(`SELECT item_id, tool_name, "Owner", parcel_number, tool_person, detail, time_start, time_stop, items.tag_address,tag_id
        FROM diis.items,diis.tag 
        Where tag.tag_address = items.tag_address
        order by time_stop desc`);
        output = {
            status: "success",
            result: result
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        }
    }
    res.json(output);
}

/********************************* GET TABLE SCANLOG / **********************************/

const getScanlog = async(req, res) => {
    try {
        const result = await pool.query(`select device_address , scanlog.scanner_id , scan_timestamp ,room
        FROM diis.scanlog 
        INNER join  diis.scanner 
        ON scanlog.scanner_id = scanner.scanner_address 
        INNER join  diis.location
        ON  scanner.location_id = location.location_id 
        order by scan_timestamp desc `);
        output = {
            status: "success",
            result: result
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        }
    }
    res.json(output);
}


/********************************* GET TABLE SELECT SCANLOG **********************************/

const getSelectlog = async(req, res) => {
    try {
        console.log(req.query)
        let device_address = "NULL";
        let time_start = "NULL";
        let time_stop = "NULL";
            if (req.query.device_address != undefined) {
                device_address = req.query.device_address;
            }
            if (req.query.time_start != undefined) {
                time_start = req.query.time_start;
            }
            if (req.query.time_stop != "Invalid date") {
                time_stop = req.query.time_stop;
            }else{
                time_stop = moment().locale('th').format()
            }
            const result = await pool.query(`select device_name ,device_address , scanlog.scanner_id , scan_timestamp ,room ,device_rssi 
        FROM diis.scanlog 
        INNER join  diis.scanner 
        ON scanlog.scanner_id = scanner.scanner_address 
        INNER join  diis.location
        ON  scanner.location_id = location.location_id 
        where scanlog.device_address = '${device_address}' and scan_timestamp >= '${time_start}' and scan_timestamp <= '${time_stop}'
        order by scan_timestamp desc `);
        
        console.log(time_start)
        console.log(time_stop)
        output = {
            status: "success",
            result: result
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        }
    }
    res.json(output);
}

/****************************************************** CREATE API ALL TABLE ******************************************************/

/************************************** CREATE TABLE TAG ************************************/

const createTag = async(req, res) => {
    try {
        for (let id in req.body) {

            let tag_address = "NULL";

            if (req.body[id].tag_address != undefined) {
                tag_address = req.body[id].tag_address;
            }
            const sql = `INSERT INTO diis.tag (tag_address) VALUES('${tag_address}')`
            await pool.query(sql)
        }

        output = {
            status: "success",
            result: req.body.lenght
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/************************************** CREATE Items ************************************/

const createItem = async(req, res) => {
    try {
        for (let id in req.body) {
            console.log(req.body);
            let tool_name = "NULL";
            let Owner = "NULL";
            let parcel_number = "NULL";
            let tool_person = "NULL";
            let detail = "NULL";
            let tag_address = "NULL";

            if (req.body[id].tool_name != undefined) {
                tool_name = req.body[id].tool_name;
            }
            if (req.body[id].Owner != undefined) {
                Owner = req.body[id].Owner;
            }
            if (req.body[id].parcel_number != undefined) {
                parcel_number = req.body[id].parcel_number;
            }
            if (req.body[id].tool_person != undefined) {
                tool_person = req.body[id].tool_person;
            }
            if (req.body[id].detail != undefined) {
                detail = req.body[id].detail;
            }
            if (req.body[id].tag_address != undefined) {
                tag_address = req.body[id].tag_address;
            }
            const time_start = moment().locale('th').format();
            const sql = `INSERT INTO diis.items
            (tool_name, "Owner", parcel_number, tool_person, detail, time_start, tag_address)
            VALUES('${tool_name}', '${Owner}', '${parcel_number}', '${tool_person}', '${detail}', '${time_start}', '${tag_address}');`
            await pool.query(sql)
        }

        output = {
            status: "success",
            result: req.body.lenght
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}


/************************************** CREATE TABLE TAGUSE *********************************/

const createTaguse = async(req, res) => {
    try {
        for (let id in req.body) {

            let tag_address = "NULL";
            let visitor_id = "NULL";

            if (req.body[id].tag_address != undefined) {
                tag_address = req.body[id].tag_address;
            }
            if (req.body[id].visitor_id != undefined) {
                visitor_id = req.body[id].visitor_id;
            }
            const time = moment().locale('th').format();
            const sql = `INSERT INTO diis.taguse (tag_address, time_start, visitor_id) VALUES('${tag_address}', '${time}', ${visitor_id})`
            await pool.query(sql)
        }
        output = {
            status: "success",
            result: req.body.lenght
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/************************************** CREATE TABLE SCANNER ********************************/

const createScanner = async(req, res) => {
    try {
        for (let id in req.body) {

            let location_id = "NULL";
            let scanner_address = "NULL";
            let description = "NULL";

            if (req.body[id].location_id != undefined) {
                location_id = req.body[id].location_id;
            }
            if (req.body[id].scanner_address != undefined) {
                scanner_address = req.body[id].scanner_address;
            }
            if (req.body[id].description != undefined) {
                description = req.body[id].description;
            }
            const sql = `INSERT INTO diis.scanner (location_id, scanner_address, description) VALUES(${location_id}, '${scanner_address}', '${description}')`
            await pool.query(sql)
        }
        output = {
            status: "success",
            result: req.body.lenght
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/************************************** CREATE TABLE LOCATION *******************************/

const createLocation = async(req, res) => {
    try {
        for (let id in req.body) {

            let room = "NULL";
            let floor = "NULL";

            if (req.body[id].room != undefined) {
                room = req.body[id].room;
            }
            if (req.body[id].floor != undefined) {
                floor = req.body[id].floor;
            }
            const sql = `INSERT INTO diis."location" (room, floor) VALUES('${room}', ${floor})`
            await pool.query(sql)
        }
        output = {
            status: "success",
            result: req.body.lenght
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/************************************** CREATE TABLE VISITOR ********************************/

const createVisitor = async(req, res) => {
    try {
        console.log(req)
        for (let id in req.body) {

            let tag_address = "NULL";
            let first_name = "NULL";
            let last_name = "NULL";
            let tel = "NULL";
            let category = "NULL";
            let id_civiliz = "NULL";
            let contract = "NULL";

            if (req.body[id].tag_address != undefined) {
                tag_address = req.body[id].tag_address;
            }
            if (req.body[id].first_name != undefined) {
                first_name = req.body[id].first_name;
            }
            if (req.body[id].last_name != undefined) {
                last_name = req.body[id].last_name;
            }
            if (req.body[id].tel != undefined) {
                tel = req.body[id].tel;
            }
            if (req.body[id].category != undefined) {
                category = req.body[id].category;
            }
            if (req.body[id].id_civiliz != undefined) {
                id_civiliz = req.body[id].id_civiliz;
            }
            if (req.body[id].contract != undefined) {
                contract = req.body[id].contract;
            }
            const time = moment().locale('th').format();
            // const sql = `INSERT INTO diis.visitor (tag_address,first_name, last_name, tel, category,id_civiliz,contract,time_start) VALUES(${tag_address}','${first_name}', '${last_name}', '${tel}', '${category}', '${id_civiliz}', '${contract}','${time}')`
            const sql = `INSERT INTO diis.visitor(first_name, last_name, tel, category, id_civiliz, contract, time_start, tag_address) VALUES( '${first_name}', '${last_name}', '${tel}', '${category}', '${id_civiliz}', '${contract}', '${time}', '${tag_address}');`
            
            await pool.query(sql)
        }
        output = {
            status: "success",
            result: req.body.lenght
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/************************************** CREATE TABLE SCANLOG ********************************/

const createScanlog = async(req, res) => {
    try {
        for (let id in req.body) {

            let scanner_id = "NULL";
            let device_address = "NULL";
            let device_name = "NULL";
            let device_rssi = "NULL";

            if (req.body[id].scanner_id != undefined) {
                scanner_id = req.body[id].scanner_id;
            }
            if (req.body[id].device_address != undefined) {
                device_address = req.body[id].device_address;
            }
            if (req.body[id].device_name != undefined) {
                device_name = req.body[id].device_name;
            }
            if (req.body[id].device_rssi != undefined) {
                device_rssi = req.body[id].device_rssi;
            }

            // const time = new Date(Date.now()).toISOString();
            const time = moment().locale('th').format();;
           const sql = `INSERT INTO diis.scanlog
            (scanner_id, device_address, device_name, scan_timestamp, device_rssi)
            VALUES('${scanner_id}', '${device_address}', '${device_name}', '${time}', ${device_rssi});
            `;
            await pool.query(sql);
        }

        output = {
            status: "success",
            result: req.body.lenght
        }
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
    console.warn(this.sql)
}

/***************************************************** UPDATE API ALL TABLE *******************************************************/

/*************************************** UPDATE TABLE TAG **********************************/

const updateTag = async(req, res) => {
    try {
        
        const result = await pool.query(`UPDATE diis.tag SET tag_address = '${req.body.tag_address}' where tag_id = ${req.params.id}`);
        
        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        output = {
            status: "failed",
            result: error
            
        };
    }
    res.json(output);
}

/*************************************** UPDATE TABLE TAGUSE *******************************/

const updateTaguse = async(req, res) => {
    try {
        // const result = await pool.query(`UPDATE diis.taguse SET taguse_id=${req.body.taguse_id}('diis.taguse_taguse_id_seq'::regclass), tag_address='${req.body.tag_address}', time_start='${req.body.time_start}', time_stop='${req.body.time_stop}', visitor_id=${req.body.visitor_id} where taguse_id = ${req.params.taguse_id}`);
        // console.log(req.body.visitor_id);
        const result = await pool.query(`UPDATE diis.taguse SET time_stop='${req.body.time_stop}' where taguse_id = '${req.params.id}'`);
        
        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        console.log(error.message)
        output = {
            status: "failed para",
            result: error
        };
    }
    res.json(output);
}

/*************************************** UPDATE TABLE LOCATION *****************************/

const updateLocation = async(req, res) => {
    try {
        const result = await pool.query(`UPDATE diis."location"
        SET room='${req.body.room}', floor=${req.body.floor}
        WHERE location_id=${req.params.location_id};
            `);
        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/*************************************** UPDATE TABLE SCANNER ******************************/

const updateScanner = async(req, res) => {
    try {
        const result = await pool.query(`UPDATE diis.scanner
            SET scanner_id=${req.body.scanner_id}('diis.scanner_scanner_id_seq'::regclass), location_id=${req.body.location_id}, scanner_address='${req.body.scanner_address}', description='${req.body.description}' where scanner_id = ${req.params.scanner_id}`);
        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/*************************************** UPDATE TABLE VISITOR ******************************/

const updateVisitor = async(req, res) => {
    try {

        const result = await pool.query(`UPDATE diis.visitor SET time_stop='${req.body.time_stop}'  where visitor_id = ${req.params.id}`);
        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/*************************************** UPDATE data Person******************************/

const updateData = async(req, res) => {
    try {
        console.log(req.params.id)
        console.log(req.body)
        console.log(`UPDATE diis.visitor SET first_name='${req.body.first_name}', last_name='${req.body.last_name}', tel='${req.body.tel}', category='${req.body.category}', id_civiliz='${req.body.id_civiliz}', contract='${req.body.contract}' where visitor_id = ${req.params.id};`)
        const result = await pool.query(`UPDATE diis.visitor SET first_name='${req.body.first_name}', last_name='${req.body.last_name}', tel='${req.body.tel}', category='${req.body.category}', id_civiliz='${req.body.id_civiliz}', contract='${req.body.contract}' where visitor_id = ${req.params.id};`);
        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/*************************************** UPDATE data Object******************************/

const updateDataItem = async(req, res) => {
    try {
        console.log(req.params.id)
        console.log(req.body)
        console.log(`UPDATE diis.items SET tool_name='${req.body.tool_name}', "Owner"='${req.body.Owner}', parcel_number='${req.body.parcel_number}', tool_person='${req.body.tool_person}', detail='${req.body.detail}' where item_id = ${req.params.id};`)
        const result = await pool.query(`UPDATE diis.items SET tool_name='${req.body.tool_name}', "Owner"='${req.body.Owner}', parcel_number='${req.body.parcel_number}', tool_person='${req.body.tool_person}', detail='${req.body.detail}' where item_id = ${req.params.id}`);
        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/*************************************** UPDATE TABLE ITEM ******************************/

const updateItem = async(req, res) => {
    try {
        const result = await pool.query(`UPDATE diis.items SET time_stop='${req.body.time_stop}' where item_id = ${req.params.id}`);
        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/*************************************** UPDATE TABLE SCANLOG ******************************/

const updateScanlog = async(req, res) => {
        try {
            const result = await pool.query(`UPDATE diis.scanlog
        SET id=${req.body.id}('diis.scanlog_id_seq'::regclass), scanner_id='${req.body.scanner_id}', device_address='${req.body.device_address}', device_name='${req.body.device_name}', device_appearance='${req.body.device_appearance}', device_manufacturerdata='${req.body.device_manufacturerdata}', device_serviceuuid='${req.body.device_serviceuuid}', device_txpower=${req.body.device_txpower}, scan_timestamp='${req.body.scan_timestamp}', device_rssi=${req.body.device_rssi} where id = ${req.params.id}`);
            output = {
                status: "success",
                result: result
            };
        } catch (error) {
            output = {
                status: "failed",
                result: error
            };
        }
        res.json(output);
    }
    /***************************************************** DELETE API ALL TABLE *******************************************************/

/*********************************** DELETE TABLE TAG ************************************/
const deleteTag = async(req, res) => {
    try {
        const result = await pool.query(`DELETE FROM diis.tag WHERE tag_id = ${req.params.tag_id} `);
        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/*********************************** DELETE TABLE TAGUSE *********************************/

const deleteTaguse = async(req, res) => {
    try {
        const result = await pool.query(`DELETE FROM diis.taguse WHERE taguse_id = ${req.params.taguse_id}`);
        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/*********************************** DELETE TABLE LOCATION *******************************/

const deleteLocation = async(req, res) => {
    try {
        const result = await pool.query(`DELETE FROM diis.location WHERE location_id = ${req.params.location_id}`);
        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/*********************************** DELETE TABLE SCANNER ********************************/

const deleteScanner = async(req, res) => {
        try {
            const result = await pool.query(`DELETE FROM diis.scanner WHERE scanner_id = ${req.params.scanner_id}`);
            output = {
                status: "success",
                result: result
            };
        } catch (error) {
            output = {
                status: "failed",
                result: error
            };
        }
        res.json(output);
    }
    /*********************************** DELETE TABLE VISITOR ********************************/

const deleteVisitor = async(req, res) => {
        try {
            const result = await pool.query(`DELETE FROM diis.visitor WHERE visitor_id = ${req.params.visitor_id}`);
            output = {
                status: "success",
                result: result
            };
        } catch (error) {
            output = {
                status: "failed",
                result: error
            };
        }
        res.json(output);
    }
    /*********************************** DELETE TABLE SCANLOG ********************************/
const deleteScanlog = async(req, res) => {
    try {
        const result = await pool.query(`DELETE FROM diis.scanlog
        WHERE id = ${req.params.id};
        `);
        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
    }
    res.json(output);
}

/**********************************************************/

const getData = async(req, res) => {
        try {
            const result = await pool.query(`select * from diis.tag
    inner join diis.taguse on
        diis.tag.tag_address = diis.taguse.tag_address
    inner join diis.visitor on
        diis.taguse.visitor_id = diis.visitor.visitor_id`);

            output = {
                status: "success",
                result: result
            };
        } catch (error) {
            output = {
                status: "failed",
                result: error
            };
            console.log(error.message);

        }
        res.json(output);
    }
    /***********************************************************/
const getData2 = async(req, res) => {
    try {
        const result = await pool.query(`select
        *
    from
        diis.scanlog 
    inner join diis.scanner on
        diis.scanlog.scanner_id = diis.scanner.scanner_address 
    inner join diis.location on
        diis.scanner.location_id = diis.location.location_id`);

        output = {
            status: "success",
            result: result
        };
    } catch (error) {
        output = {
            status: "failed",
            result: error
        };
        console.log(error.message);

    }
    res.json(output);
}

module.exports = {
    getTag,
    getTaguse,
    getScanner,
    getLocation,
    getVisitor,
    getScanlog,
    createTag,
    createTaguse,
    createScanner,
    createLocation,
    createVisitor,
    createScanlog,
    updateTag,
    updateTaguse,
    updateLocation,
    updateScanner,
    updateVisitor,
    updateScanlog,
    deleteTag,
    deleteTaguse,
    deleteLocation,
    deleteScanner,
    deleteVisitor,
    deleteScanlog,
    getData,
    getData2,
    getSelectlog,
    createItem,
    getItem,
    updateItem,
    getEdit,
    updateData,
    getEditItem,
    updateDataItem
}