const cron = require('node-cron');
const { getRowToTable, updateRowToTable, addRowToTable, getTBChartLoteryOneLimitLast } = require('./query');
const logger = require('../config/logger');

function ramdomNumber(min, max) {
  return Math.floor(Math.random() * max + min);
}

async function successOrder(order, obj, xNumber, flag, tableOrder) {
  // const user = await getRowToTable(`tb_user`, `id=${order.userid}`)
  const arrayPromise = [];
  if (flag) {
    /// thắng
    const amountOrder = order.balance;
    // eslint-disable-next-line no-param-reassign
    order.fee = 0.98;
    const profits = amountOrder * xNumber - (amountOrder - amountOrder * order.fee);
    const user = await getRowToTable(`users`, `id='${order.userid}'`);
    arrayPromise.push(
      updateRowToTable(`users`, `balance=${user[0].balance + profits}`, `id='${order.userid}'`),
      updateRowToTable(tableOrder, `status='SUCCESS',profit=${profits}`, `id=${order.id}`)
    );
  } else {
    arrayPromise.push(updateRowToTable(tableOrder, `status='SUCCESS',profit=0`, `id=${order.id}`));
  }
}

async function loteryOrder(order, obj, tableOrder) {
  try {
    const amountSet = parseInt(obj.number, 10) + parseInt(obj.number2, 10) + parseInt(obj.number3, 10);
    /// order Thập (tài)
    logger.info(obj.number, obj.number2, obj.number3);

    logger.info(amountSet, 'amountSet');
    if (order.orderTalent === 1) {
      if (amountSet >= 11) {
        /// / thắng
        await successOrder(order, obj, 2, true, tableOrder);
      } else {
        /// thua
        await successOrder(order, obj, 1, false, tableOrder);
      }
    }
    /// order Tứ (xỉu)
    else if (order.orderFaint === 1) {
      if (amountSet <= 10) {
        /// / thắng
        await successOrder(order, obj, 2, true, tableOrder);
      } else {
        /// thua
        await successOrder(order, obj, 1, false, tableOrder);
      }
    }
    /// // orderEven Cô (chẵn)
    else if (order.orderEven === 1) {
      if (amountSet % 2 === 0) {
        /// / thắng
        await successOrder(order, obj, 2, true, tableOrder);
      } else {
        /// thua
        await successOrder(order, obj, 1, false, tableOrder);
      }
    }
    /// // orderEven Nương (lẽ)
    else if (order.orderOdd === 1) {
      if (amountSet % 2 === 1) {
        /// / thắng
        await successOrder(order, obj, 2, true, tableOrder);
      } else {
        /// thua
        await successOrder(order, obj, 1, false, tableOrder);
      }
    }
  } catch (error) {
    logger.error(error, 'loteryOrder');
  }
}

async function closeLotery(obj, tableOrder) {
  try {
    const allOrder = await getRowToTable(tableOrder, `status='PENDDING' AND time=${obj.time} AND name='${obj.name}'`);
    const arrayPromise = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const order of allOrder) {
      arrayPromise.push(loteryOrder(order, obj, tableOrder));
    }
  } catch (error) {
    logger.error(error, 'closeLotery');
  }
}

function sessionId(sess, name) {
  let sessz = sess;
  if (name === 'time') sessz = 7;
  const timea = new Date().getTime() + 1000 * 60 * 60 * 7;
  const time = new Date(timea);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const timeStart = new Date(year, month - 1, day).getTime();
  const timeMinu = time.getTime() - timeStart;
  const minutes = parseInt(timeMinu / 1000 / 60, 10);
  const stringMinutes = 10000 + minutes;
  const string = `${year}${month}${day}${sessz}${stringMinutes}`;
  return string;
}

async function ramdomLotery(time, name, table, tableOrder, io) {
  try {
    const chartLotery = await getTBChartLoteryOneLimitLast(table, time, name); /// LÁT PHIÊN ĐANG CHỜ XỔ
    if (chartLotery.length <= 0) {
      const objItem = {
        // number: ramdomNumber(1, 7),
        // number2: ramdomNumber(1, 7),
        // number3: ramdomNumber(1, 7),
        sessionId: sessionId(time),
        time,
        name,
      };
      await addRowToTable(`tb_chart_lotery`, objItem);
      return;
    }
    let number;
    let number2;
    let number3;
    if (chartLotery[0].closeNumber == null)
      number = ramdomNumber(1, 6); /// nếu admin chưa chỉnh số thì sẽ ramdom xố từ 1 - 9
    else number = chartLotery[0].closeNumber; /// lấy số admin đã chỉnh
    if (chartLotery[0].closeNumber2 == null)
      number2 = ramdomNumber(1, 6); /// nếu admin chưa chỉnh số thì sẽ ramdom xố từ 1 - 9
    else number2 = chartLotery[0].closeNumber2; /// lấy số admin đã chỉnh
    if (chartLotery[0].closeNumber3 == null)
      number3 = ramdomNumber(1, 6); /// nếu admin chưa chỉnh số thì sẽ ramdom xố từ 1 - 9
    else number3 = chartLotery[0].closeNumber3; /// lấy số admin đã chỉnh
    const obj = {
      time,
      name,
    };
    /// // mỗi phiên kết thúc sẽ tăng lên 1 và gắn kết quả được tính vào chart lottery
    // eslint-disable-next-line no-unused-vars
    const dataAddOrder = await updateRowToTable(
      `tb_chart_lotery`,
      `number=${number},number2=${number2},number3=${number3}`,
      `id=${chartLotery[0].id}`
    );
    obj.sessionId = sessionId(time, name);
    /// / Update kết quả lottery
    // eslint-disable-next-line no-unused-vars
    const dataAdd = await addRowToTable(table, obj); // THÊM PHIÊN MỚI
    const objReturn = {
      number,
      number2,
      number3,
      time,
      name,
    };
    await closeLotery(objReturn, `tb_order`); // TÍNH KẾT QUẢ USER ĐẶT CƯỢC
    io.local.emit(`CHART${name}`, obj); // TRẢ KẾT QUẢ CHO FRONT END
  } catch (error) {
    logger.error(error, 'ramdomLotery');
  }
}

function addPushArrayTime(time, minute, arrayPromise, table, tableOrder, io) {
  if (time[0].value >= 60 * minute) {
    /// /// thêm phiên mới
    logger.info('ok', minute);

    arrayPromise.push(
      updateRowToTable(`tb_config`, `value=1`, `name='${time[0].name}'`),
      ramdomLotery(minute, time[0].name, table, tableOrder, io)
    );
  } else if (time[0].value === 1) {
    /// / cập nhật time
    arrayPromise.push(updateRowToTable(`tb_config`, `value=value+1`, `name='${time[0].name}'`));
  } else {
    arrayPromise.push(updateRowToTable(`tb_config`, `value=value+1`, `name='${time[0].name}'`));
  }
}

async function returnTime(name, namespace, io) {
  const timeReturn = await getRowToTable(`tb_config`, `name='${name}'`);
  if (timeReturn.length > 0) {
    io.local.emit(namespace, timeReturn[0].value);
  }
}
async function cronLottery(io) {
  try {
    cron.schedule('* * * * * *', async function () {
      try {
        /// // SET TIME 1P
        const arrayPromise = [];
        const timeQuery = getRowToTable(`tb_config`, `name='time'`); /// getTime từ DB
        const timeQuery3 = getRowToTable(`tb_config`, `name='time2'`); /// getTime từ DB
        const timeQuery5 = getRowToTable(`tb_config`, `name='time3'`); /// getTime từ DB
        const timeQuery10 = getRowToTable(`tb_config`, `name='time5'`); /// getTime từ DB
        const [time, time2, time5, time10] = await Promise.all([timeQuery, timeQuery3, timeQuery5, timeQuery10]);
        addPushArrayTime(time, 2, arrayPromise, `tb_chart_lotery`, `tb_order`, io);
        addPushArrayTime(time2, 2, arrayPromise, `tb_chart_lotery`, `tb_order`, io);
        addPushArrayTime(time5, 3, arrayPromise, `tb_chart_lotery`, `tb_order`, io);
        addPushArrayTime(time10, 5, arrayPromise, `tb_chart_lotery`, `tb_order`, io);
        await Promise.all(arrayPromise);
        /// / Trả time cho front end cập nhật trên website bằng socket
        await Promise.all([
          returnTime(`time`, `TIME`, io),
          returnTime(`time2`, `TIME2`, io),
          returnTime(`time3`, `TIME3`, io),
          returnTime(`time5`, `TIME5`, io),
        ]);
      } catch (error) {
        logger.error(error);
      }
    });
  } catch (error) {
    logger.error(error, 'cronlottery');
  }
}
module.exports = {
  cronLottery,
};
