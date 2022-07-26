import { Table, Button, message } from "antd";
import { useEffect, useState } from "react";
import {
  GetItemLists,
  GetProductionDetailsDate,
} from "../../Services/appServices/ProductionService";
import { CSVLink } from "react-csv";
import { newTableStyles } from "../../Components/Common/TableStyles";

const ProductionEntryTab = (props) => {
  const { reloadTable, tableAfterReloaded } = props;
  // const [isEditing, setisEditing] = useState(false);
  const [ProductList, setProductList] = useState();
  // const [editingProduct, setEditingProduct] = useState();
  const [ItemLists, setItemLists] = useState();
  useEffect(() => {
    if (reloadTable === true) {
      getTableData();
      tableAfterReloaded(false);
    }
  }, [reloadTable]);
  useEffect(() => {
    // const date = new Date().toISOString();
    getTableData();
    GetItemLists((res) => {
      // console.log("item list", res.ItemList);
      setItemLists(res.ItemList);
    });
  }, []);

  function getTableData() {
    const date = {
      fromdate: new Date().toISOString(),
      todate: new Date().toISOString(),
    };
    GetProductionDetailsDate(date, (res) => {
      if (res?.ItemList.length > 0) {
        setProductList(res?.ItemList);
      }
    });
  }
  const addName = () => {
    let tempArr = [];
    let temp;
    if (ProductList !== undefined) {
      ProductList.map((e) => {
        let newItemName = "";
        ItemLists.forEach((res) => {
          if (res.itmId === e.ItemId) {
            newItemName = res.ItmName;
          }
        });
        temp = {
          ItemName: newItemName,
          ...e,
        };
        tempArr.push(temp);
      });
    }
    return tempArr;
  };

  const columns = [
    {
      title: "PId",
      dataIndex: "PId",
      key: "PId",
    },
    {
      title: "ItemId",
      dataIndex: "ItemId",
      key: "ItemId",
      render: (text, record) => {
        let a;
        if (ItemLists !== undefined) {
          a = ItemLists.map((res) => {
            if (res.itmId === text) return res.ItmName;
            else return "";
          });
        }
        return a;
      },
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },

    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
    },
  ];
  //CSV
  const headers = [
    { label: "UserId", key: "UserId" },
    { label: "PId", key: "PId" },
    { label: "ItemId", key: "ItemId" },
    { label: "Item Name", key: "ItemName" },
    { label: "Quantity", key: "Quantity" },
    { label: "EntryDate", key: "EntryDate" },
    { label: "Remarks", key: "Remarks" },
  ];
  // handel print
  const printHandle = () => {
    const temp = addName();

    if (ProductList !== 0) {
      let newWindow = window.open();

      let newStyle = ``;

      newStyle = `<style>thead > tr> th:first-child, thead > tr> th:nth-child(2), tbody > tr > td:first-child,tbody > tr > td:nth-child(2){
        display: none;
       }tbody > tr:last-child{
    background-color: #f0f0f2;
    }
    tbody > tr:last-child > td{
        font-size: 12px;
        font-weight: 500;
    }</style>`;

      let refName = `
      <div style='text-align:center;'>
          <h1>Baker's Den Pvt.ltd<h1>
          <h3>Naxal, Bhatbhateni, Kathmandu, Phone: 01-4416560<h3>
          <h5>Production Data<h5>
      </div>
    
      `;

      let tableBody = "";
      let tableHeadHtml = "<thead>";
      let columns = [];

      headers.forEach((ele) => {
        tableHeadHtml += `<th>${ele?.label}</th>`;
        columns.push(ele.key);
      });
      tableHeadHtml += "</thead>";

      temp.forEach((ele) => {
        tableBody = tableBody + "<tr>";
        columns.forEach((cell) => {
          tableBody = tableBody + "<td>" + ele[cell] + "</td>";
        });
        tableBody = tableBody + "</tr>";
      });

      let allTable = `<table>${tableHeadHtml}${tableBody}</table>`;

      newWindow.document.body.innerHTML =
        newTableStyles + newStyle + refName + allTable;

      setTimeout(function () {
        newWindow.print();
        newWindow.close();
      }, 300);
    } else {
      message.info("select some data");
    }
  };

  return (
    <>
      <Button
        type="primary"
        style={{ margin: "20px", float: "right" }}
        onClick={printHandle}
      >
        Print
      </Button>
      <Button type="primary" style={{ margin: "20px 5px", float: "right" }}>
        <CSVLink
          data={ProductList !== undefined ? ProductList : ""}
          filename={"ProductionData.csv"}
        >
          Export to CSV
        </CSVLink>
      </Button>

      <div>
        <Table
          columns={columns}
          dataSource={ProductList !== undefined ? ProductList : ""}
          style={{ height: "450px" }}
          scroll={{
            y: 340,
          }}
        />
      </div>
    </>
  );
};
export default ProductionEntryTab;
