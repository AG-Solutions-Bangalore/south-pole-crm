import ApiErrorPage from "@/components/api-error/api-error";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { CONTRACT_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Printer } from "lucide-react";
import moment from "moment";
import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
const ContractExport = () => {
  const { id } = useParams();
  const printRef = useRef();
  const [contractData, setContractData] = useState(null);
  const [branchData, setBranchData] = useState({});
  const [contractSubData, setContractSubData] = useState([]);
  const { trigger: fetchData, loading, error } = useApiMutation();

  const fetchContractData = async () => {
    try {
      const response = await fetchData({
        url: CONTRACT_API.getById(id),
      });
      setContractData(response.data);
      setBranchData(response.branch);
      setContractSubData(response.data.subs);
    } catch (error) {
      console.warn(error);
    }
  };
  useEffect(() => {
    fetchContractData();
  }, [id]);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Sales Accounts Report",
    pageStyle: `
      @page {
      size: auto;
 margin: 3mm 3mm 3mm 3mm;
        border: 0px solid black;
      
    }
    @media print {
      body {
        border: 0px solid red;
        margin: 1mm;
        padding: 1mm 1mm 1mm 1mm;
        min-height: 100vh;
      }
      .print-hide {
        display: none;
      }
     
    }
    `,
  });
  const safe = (value) => value || "\u00A0";

  const grandTotalQty = contractSubData.reduce((total, item) => {
    return total + Number(item.contractSub_qnty || 0);
  }, 0);
  const grandTotalValue = contractSubData.reduce((total, item) => {
    const qty = Number(item.contractSub_qnty || 0);
    const rate = Number(item.contractSub_selling_rate || 0);
    return total + qty * rate;
  }, 0);

  if (error) return <ApiErrorPage />;
  return (
    <div className="relative">
      {loading && <LoadingBar />}
      <Button
        variant="outline"
        onClick={handlePrint}
        className="gap-2 absolute top-0 right-12"
      >
        <Printer className="w-4 h-4" />
        Print
      </Button>
      <div className="font-normal" ref={printRef}>
        {contractData && (
          <>
            <div className="max-w-4xl mx-auto p-4 ">
              <div className="border-t border-r border-l border-black max-w-screen-lg mx-auto text-sm">
                <div>
                  <div className="border-b border-black px-8 py-2  text-center text-sm font-bold  ">
                    CONTRACT
                  </div>
                </div>

                <div className="grid grid-cols-12 border-b border-black text-[12px]">
                  <div className="col-span-6 border-r border-black">
                    <div className="p-2">
                      <p className="font-bold text-[13px]">
                        {contractData.branch_name}
                      </p>

                      <div className="mt-1">
                        {branchData?.branch_crop_address || ""}
                      </div>
                      <div>{branchData?.branch_address || ""}</div>
                      <div>
                        <span className="font-semibold">GSTIN:</span>{" "}
                        {branchData?.branch_gst || ""}{" "}
                        <span className="font-semibold">IEC:</span>{" "}
                        {branchData?.branch_iec || ""}
                      </div>

                      <div>
                        <span className="font-semibold">Mobile:</span>{" "}
                        {branchData?.branch_mobile_no || ""}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span>{" "}
                        {branchData?.branch_email_id || ""}
                      </div>
                    </div>

                    <div className="border-t border-black grid grid-cols-2 gap-2 min-h-40">
                      <div className="p-2 border-r border-black h-full">
                        <p className="font-bold">Buyer:</p>
                        <p className="font-bold">
                          {contractData.contract_buyer}
                        </p>
                        <div className="mt-1">
                          {contractData.contract_buyer_add}
                        </div>
                      </div>
                      <div className="px-1 py-2">
                        <p className="font-bold">Consignee:</p>
                        <p className="font-bold">
                          {contractData.contract_consignee}
                        </p>
                        <div className="mt-1">
                          {contractData.contract_consignee_add}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-6  text-[12px]">
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Contract No:
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px] font-bold">
                        {" "}
                        Date:
                      </div>
                    </div>

                    {/* Date */}
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5  min-h-[22px]">
                        {safe(contractData?.contract_ref)}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {contractData?.contract_date
                          ? moment(contractData.contract_date).format(
                              "DD-MM-YYYY",
                            )
                          : "\u00A0"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Pre Carriage by
                      </div>
                      <div className="px-2 py-0.5 font-bold min-h-[22px]">
                        Place of Receipt of Pre-Carrier
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 min-h-[22px]">
                        {safe(contractData?.contract_precarriage)}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">-</div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Vessel / Flight No.
                      </div>
                      <div className="px-2 py-0.5 font-bold min-h-[22px]">
                        Port Of Loading
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 min-h-[22px]">
                        {safe(contractData?.contract_vessel_flight_no)}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {safe(contractData?.contract_loading)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Port Of Discharge
                      </div>
                      <div className="px-2 py-0.5 font-bold min-h-[22px]">
                        Final Destination
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 min-h-[22px]">
                        {safe(contractData?.contract_discharge)}
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {safe(contractData?.contract_destination_country)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 font-bold min-h-[22px]">
                        Country of Origin of Goods
                      </div>
                      <div className="px-2 py-0.5 font-bold min-h-[22px]">
                        Country Of Final Destination
                      </div>
                    </div>

                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r border-black px-2 py-0.5 min-h-[22px]">
                        India
                      </div>
                      <div className="px-2 py-0.5 min-h-[22px]">
                        {safe(contractData?.contract_destination_country)}
                      </div>
                    </div>

                    <div className="px-2 py-1 min-h-[36px]">
                      <p className="font-bold">Terms of Delivery and Payment</p>
                      <p>{safe(contractData?.contract_payment_terms)}</p>
                    </div>
                  </div>
                </div>

                <div className="text-[12px]">
                  <table className="w-full border-collapse table-auto border-b border-black ">
                    <thead>
                      <tr className="border-b border-black text-[12px]">
                        <th
                          className="border-r border-black text-center text-[11px]"
                          style={{ width: "60%" }}
                        >
                          Item Description
                        </th>

                        <th
                          className="border-r border-black  text-center text-[11px]"
                          style={{ width: "10%" }}
                        >
                          Quantity
                        </th>
                        <th
                          className="border-r border-black  text-center text-[11px]"
                          style={{ width: "10%" }}
                        >
                          Rate
                        </th>
                        <th
                          className="text-center text-[11px]"
                          style={{ width: "10%" }}
                        >
                          Amount{" "}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {contractSubData.map((items, groupIndex) => {
                        return (
                          <Fragment key={groupIndex}>
                            <tr className="border-t border-black text-[11px]">
                              <td className="border-r border-black px-2">
                                <p className="text-[10px]">
                                  {items.contractSub_item_name}
                                </p>
                              </td>

                              <td className="border-r border-black  text-center">
                                {" "}
                                {Number(items.contractSub_qnty || 0).toFixed(0)}
                              </td>
                              <td className="border-r border-black  text-right px-2">
                                {" "}
                                {items.contractSub_selling_rate}
                              </td>
                              <td className="text-right px-2">
                                {" "}
                                {(
                                  Number(items.contractSub_qnty) *
                                  Number(items.contractSub_selling_rate)
                                ).toFixed(2)}
                              </td>
                            </tr>
                          </Fragment>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-y border-black text-[12px]">
                        <td className="border-r border-black text-center font-bold">
                          Total:
                        </td>
                        <td className="border-r border-black px-2  text-center font-bold">
                          {grandTotalQty}
                        </td>

                        <td className="border-r border-black text-center"></td>

                        <td className="px-2  text-right font-bold">
                          {grandTotalValue.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="page-break"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContractExport;
