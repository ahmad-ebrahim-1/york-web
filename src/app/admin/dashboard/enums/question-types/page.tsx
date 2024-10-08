"use client";
import AlertModal from "@/components/Pars/AlertModal";
import Loading from "@/components/Pars/Loading";
import OperationAlert from "@/components/Pars/OperationAlert";
import Action from "@/components/crud/Action";
import CrudLayout from "@/components/crud/CrudLayout";
import AddEnums from "@/components/enums/AddEnums";
import EditEnums from "@/components/enums/EditEnums";
import ShowEnumDetailes from "@/components/enums/ShowEnumDetailes";
import {
  completedQuestionTypeOperation,
  createQuestionType,
  deleteQuestionType,
  getQuestionTypes,
  updateQuestionType,
} from "@/store/adminstore/slices/enums/questionTypesSlice";
import { GlobalState } from "@/types/storeTypes";
import mergeDifferentProperties from "@/utils/mergeDifferentProperties";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from "rsuite";
import * as yup from "yup";

export default function QuestionTypes() {
  const [activePage, setActivePage] = useState(1);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openVisible, setOpenvisible] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [term, setTerm] = useState("");
  const [enumId, setEnumId] = useState<number>(0);
  const messageOperation: string =
    (openAdd && "adding") ||
    (openEdit && "updating") ||
    (openDelete && "deleting") ||
    "";

  const dispatch: any = useDispatch();

  const {
    isLoading,
    error,
    questionTypes,
    operationLoading,
    status,
    total,
    perPage,
  } = useSelector((state: GlobalState) => state.questionTypes);

  const columns = [
    {
      name: "ID",
      selector: (row: any) => row.id,
      sortable: true,
      grow: 0,
    },
    {
      name: "Type",
      selector: (row: any) => row.type,
      sortable: true,
      grow: 0,
      style: {
        minWidth: "100px",
      },
      wrap: true,
    },
    {
      name: "Hint",
      selector: (row: any) => row.hint,
      sortable: true,
      wrap: true,
      style: {
        minWidth: "200px",
        marginInline: "10px",
      },
    },
    {
      name: "Description",
      selector: (row: any) => row.description,
      sortable: true,
      wrap: true,
      grow: 2,
      style: {
        minWidth: "300px",
        marginInline: "10px",
        padding: "10px",
      },
    },

    {
      name: "Action",
      selector: (row: any) => (
        <Action
          id={row.id}
          handleEdit={() => {
            setOpenEdit(true);
            setEnumId(row.id);
          }}
          handleVisible={() => {
            setOpenvisible(true);
            setEnumId(row.id);
          }}
          handleDelete={() => {
            setOpenDelete(true);
            setEnumId(row.id);
          }}
        />
      ),
    },
  ];

  const formFields = [
    {
      name: "type",
      label: "Type",
      type: "text",
      placeholder: "Enter an exam type",

      validation: yup.string().required("Exam Type is Required"),
    },
    {
      name: "hint",
      label: "Hint",
      type: "text",
      placeholder: "Enter an exam hint",
      validation: yup.string().required("Exam hint is Required"),
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter an exam description",
      validation: yup.string().required("Exam description is Required"),
    },
  ];

  const initialValues = {
    type: "",
    hint: "",
    description: "",
  };

  const handleSubmit = (values: any) => {
    console.log("submit", values);
    dispatch(createQuestionType(values));
  };
  const handleEdit = (values: any, singleEnum: any) => {
    console.log("submit", values);
    const data = mergeDifferentProperties(singleEnum, values);
    console.log("data", data);
    dispatch(updateQuestionType({ formData: data, enumId }));
  };

  useEffect(() => {
    dispatch(getQuestionTypes({ activePage, term }));
  }, [dispatch, activePage, term]);

  return (
    <main
      className={`pt-0 overflow-x-auto overflow-y-clip max-w-full ${
        total > perPage && "pb-[70px]"
      }`}
    >
      {" "}
      {isLoading && <Loading />}
      {!isLoading && (
        <CrudLayout
          columns={columns}
          dataTabel={questionTypes}
          openAdd={openAdd}
          setOpenAdd={setOpenAdd}
          interfaceName="Question Types"
          isThereAdd={true}
          isLoading={isLoading}
          setTerm={setTerm}
        />
      )}
      {total > perPage && (
        <Pagination
          prev
          next
          size="sm"
          total={total}
          limit={perPage}
          maxButtons={3}
          activePage={activePage}
          onChangePage={setActivePage}
          className="my-[30px] w-max absolute left-[50%] bottom-0 translate-x-[-50%] 
               [&>div_.rs-pagination-btn]:!bg-white
               [&>div_.rs-pagination-btn]:!text-[var(--primary-color2)]
               [&>div_.rs-pagination-btn]:!mx-[5px]
               [&>div_.rs-pagination-btn]:!rounded-[50%]
               [&>div_.rs-pagination-btn]:!border-none
               [&>div_.rs-pagination-btn.rs-pagination-btn-active]:!bg-[var(--primary-color2)]
               [&>div_.rs-pagination-btn.rs-pagination-btn-active]:!text-white
               "
        />
      )}
      <OperationAlert
        status={status}
        error={error}
        messageOnError={`An error occurred while ${messageOperation} (${error}) , try again `}
        messageOnSuccess={`Category has been ${messageOperation} successfully`}
        completedAction={completedQuestionTypeOperation}
        closeAdd={setOpenAdd}
        closeEdit={setOpenEdit}
        closeDelete={setOpenDelete}
      />
      <AddEnums
        formFields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        open={openAdd}
        setOpen={setOpenAdd}
        requestType="Add Question Type"
        isLoading={operationLoading}
        loadingContent="Question Type Creating ..."
      />
      <EditEnums
        id={enumId}
        open={openEdit}
        setOpen={setOpenEdit}
        isLoading={operationLoading}
        requestType="Edit Question Type"
        loadingContent="Editing ..."
        formFields={formFields}
        onSubmit={handleEdit}
        initialValues={initialValues}
        url="admin/questiontype/"
      />
      <AlertModal
        open={openDelete}
        setOpen={setOpenDelete}
        requestType="delete"
        id={enumId}
        status={status}
        completed={completedQuestionTypeOperation}
        deleteAction={deleteQuestionType}
        label="Are you sure you want to delete this question type ?"
      />
      <ShowEnumDetailes
        id={enumId}
        open={openVisible}
        setOpen={setOpenvisible}
        title="Question Type Destailes"
        url="admin/questiontype/"
      />
    </main>
  );
}
