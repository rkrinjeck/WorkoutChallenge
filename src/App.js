import WorkoutActivity from './components/WorkoutActivity';
import logo from './carebearPushup.png';
import newLogo from './NewLogo.jpg';
import RyanPic from './ryanPic.jpeg';
import SeanPic from './seanPic.jpg';
import JeffPic from './jeffPic.jpg';
import EricPic from './ericPic.jpg';
import AshleyPic from './ashleyPic.jpg';
import JessiePic from './jessiePic.jpg';
import NoraPic from './noraPic.jpg';
import errorLogo from './errorIcon.png';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import { Toast } from 'primereact/toast';
import axios from 'axios'
import { Knob } from 'primereact/knob';

import './App.css';
import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Sidebar } from 'primereact/sidebar';
import { Checkbox } from 'primereact/checkbox';
import { TabView, TabPanel } from 'primereact/tabview';


import { Tag } from 'primereact/tag';

import { ToggleButton } from 'primereact/togglebutton';

import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

const { GoogleSpreadsheet } = require('google-spreadsheet');
const pushUpDoc = new GoogleSpreadsheet('1z_l7nPvr4vN8ryDXI3Fqs359X6BkVllbdJvBFmghWiE');
const attendenceOptions = ['No', 'Yes'];

// Data Grid Columns
const columns = [
  { field: 'Name', header: 'Name' },
  { field: 'Timestamp', header: 'Timestamp' },
  { field: 'Date', header: 'Date' },
  { field: 'NumOfPullUps', header: '# of Pullups' },
  { field: 'NumOfPushups', header: '# of Pushups' },
  { field: 'NumOfSquats', header: '# of Squats' }
];

let localData =
{
  isSubmitted: false,
  team: '',
  teamData: []
}

// MAIN FUNCTION APP
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const toast = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [ip, setIP] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [myPushupList, setMyPushupList] = useState([]);
  const [totalData, setTotalData] = useState([]);

  // evaluationTitle - Title of Google Sheet
  const [evaluationTitle, setEvaluationTitle] = useState('');
  const [evaluatorFromParam, setEvaluatorFromParam] = useState(false);

  const [visibleLeft, setVisibleLeft] = useState(false);
  const [pushupsPlayer, setPushupsPlayer] = useState();
  const [pushupCount, setPushupCount] = useState();
  const [pullupCount, setPullupCount] = useState();
  const [squatCount, setSquatCount] = useState();
  const [shouldAutoCalc, setShouldAutoCalc] = useState(true);

  const queryParams = new URLSearchParams(window.location.search)
  const evaluator = queryParams.get("evaluator");

  const [goalCount, setGoalCount] = useState(5000);
  const [ryanPushupCount, setRyanPushupCount] = useState(0);
  const [ryanPullupCount, setRyanPullupCount] = useState(0);
  const [ryanSquatCount, setRyanSquatCount] = useState(0);

  const [seanPushupCount, setSeanPushupCount] = useState(0);
  const [seanPullupCount, setSeanPullupCount] = useState(0);
  const [seanSquatCount, setSeanSquatCount] = useState(0);

  const [jeffPushupCount, setJeffPushupCount] = useState(0);
  const [jeffPullupCount, setJeffPullupCount] = useState(0);
  const [jeffSquatCount, setJeffSquatCount] = useState(0);

  const [ericPushupCount, setEricPushupCount] = useState(0);
  const [ericPullupCount, setEricPullupCount] = useState(0);
  const [ericSquatCount, setEricSquatCount] = useState(0);

  const [ashleyPushupCount, setAshleyPushupCount] = useState(0);
  const [ashleyPullupCount, setAshleyPullupCount] = useState(0);
  const [ashleySquatCount, setAshleySquatCount] = useState(0);

  const [jessiePushupCount, setJessiePushupCount] = useState(0);
  const [jessiePullupCount, setJessiePullupCount] = useState(0);
  const [jessieSquatCount, setJessieSquatCount] = useState(0);

  const [noraPushupCount, setNoraPushupCount] = useState(0);
  const [noraPullupCount, setNoraPullupCount] = useState(0);
  const [noraSquatCount, setNoraSquatCount] = useState(0);

  // Get IP Address from geolocation-db.com
  const getIPAddress = async () => {
    //const res = await axios.get('https://geolocation-db.com/json/');
    //setIP(res.data.IPv4);
  }

  // Get All Teams / Player Info - Google Sheets
  const getData = async () => {
    setIsLoading(true);
    setLoadingMessage('Validating Evaluator Data');

    await pushUpDoc.useServiceAccountAuth({
      client_email: 'krinjeckplaygroundsa@krinjeckplayground.iam.gserviceaccount.com',
      private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxrZVU8ERKA7i7\nuk5E0f9KuUZw0AiK7dNPndX7272FlJmm2lv1aQgN+X22LZdt4dXvWoL6p+I39bZx\npDITVqaPW/pVE5zWzXyKY+VOhoV5JFfOzVDJWI2dPOhvV4p6fogy5V6e6IXfp85p\nRepTTV8dm1pxfDt8yHSSnp24FajcoUTNITgouM2DKk5kUQJet0IQyCLqUCCDTQ+p\nMwmg05Wx7EEMCiKFXUXoK42V4vwtz3x9cf5KZdEpbotU0bHq9WAeFspofF1r8mwp\n8doS9DK+X9bjP+j0BSdSwbyEsrMfHsIHRXQbCVDoZHKk0pp+yF3EeBcR7qItBRDr\naGf9YnsxAgMBAAECggEACpBX/xdT8BSdkKfIjIXxyEcQvZdY0q3GMQcg2Fsdvwnx\nQr7b1dD7Vh1d0I2QYcuaFSOMAwwlQo982+/XvFecCoz86r8CRbEs9OtwkEUmPWgg\nQl7prTbzIISlCy2owZSxU1lY0Vjg0MXg21h5UJ+ahp+cdn/c55PhfnAoz2+WPRvO\nJzvxrxDVrrqU1ao4ZE7aS4ikjO8XacEPfsErKHHW1DHUajz0+xcjbL9H+4AdZ0bv\nQ6CuXqQtVnAt/Q/0cukPK+zDLQCTxvYC9ocFwPNYc4rCxKskyGkZsnEgQlypjTe6\nozJNaV8BblDJuNy4rSBPOPXIX6lzmJ1JYfE9sj2MWwKBgQDXZlU7co/lAa1mVvQH\nEAU7cLzwUwEv/3/FgzOTEcXH+rFinDwzqF0iy+n2GkQyFIrgzx8fDo0+dFDAvLzu\n4BXqjJMfMyruAV/OUc0SxQRh10W5MZ999JCC9uGSTaLYvlnNMtc81eCJiULiZoF0\nHE9Ku5skU0WaO19SGqBdlU5F8wKBgQDTKxGzQiHlFdI2tjVkyXCU+L4oqlG1flm9\nZfqbaLfZmu+JYjaDV5bA3RJ4QcPZvg3gmJ0MJsDS6/Eexc/f7S0LqTyCU1ONVxLe\nMeQLqsOsDWyMkTWgNhfEnWPhUl2MiAodeFsfebEeiM2pfsW7Zvlt4UdLaRj3g70z\nUcZ0aipPSwKBgACkEk7Z+WmiBqUOTy2SM6HIpRdF9/Pvm663xDiEzgTZTxvPATLa\nJmTLHIgZ7egEPaGLnDkYbv0nlXHtXdaMHiSThICMQ21v3ZwcjDKpGWk9Hbz+U84p\nIyDwoR0xU/G3J0dABnns3P0rxmIsEeiJiQbc5gpGoSdjU9ZHtABzSEdXAoGAe+3k\n321KcyXRTya0Q0gteGBbSYZbmcZjaFI3N4nHjD/voJMxJvf6k4mq00TVai6t+kfW\ns1DzDVZHFiZFj0ekjhluV5YLjQGzIw/opCg92fWu5Pg7nqDgZhVwjsZF/LnCJfWC\nlQBYQHFNMdIivY77h88Uhl9RtcFtAndVnvDHj+0CgYBxRI2WK6nO++Im7cDhaHGg\n6pjAN5GAPRrUXzcS5DYl9vxVPwzWgM17b2bFh0gumcpH1M/8QubFPP+AOw/S3tqZ\nkSS00w1tAaA0XrF/vfIeYoH2tyb2zrTE97z/sAkAx586r8xAPdfu9tysdhPMKTLa\ntmw0lG3Cs40x50TIDHalhw==\n-----END PRIVATE KEY-----',
    });

    await pushUpDoc.loadInfo(); // loads document properties and worksheets

    // console.log(pushUpDoc);

    setLoadingMessage('Loaded Pushup Data');

    let [allPushUpSheet, totalDataSheet] = await Promise.all([pushUpDoc.sheetsByIndex[1].getRows(), pushUpDoc.sheetsByIndex[2].getRows()]);
    setMyPushupList(allPushUpSheet);
    setTotalData(totalDataSheet);
  };

  useEffect(() => {
    if (myPushupList.length > 0) {
      // console.log("HERE");
      // console.log(myPushupList);
      //setIsLoading(false);
    }

  }, [myPushupList]);

  useEffect(() => {
    if (totalData.length > 0) {
      //  console.log("I have total data");
      //  console.log(totalData);

      var ryanValues = totalData.filter(player => {
        return player.Name === "Ryan";
      });

      var seanValues = totalData.filter(player => {
        return player.Name === "Sean";
      });

      var jeffValues = totalData.filter(player => {
        return player.Name === "Jeff";
      });

      var ericValues = totalData.filter(player => {
        return player.Name === "Eric";
      });

      var ashleyValues = totalData.filter(player => {
        return player.Name === "Ashley";
      });

      var jessieValues = totalData.filter(player => {
        return player.Name === "Jessie";
      });

      var noraValues = totalData.filter(player => {
        return player.Name === "Nora";
      });

      // console.log(dadValues[0].TotalSum);
      setRyanPushupCount(ryanValues[0].TotalPushupSum);
      setRyanPullupCount(ryanValues[0].TotalPullupSum);
      setRyanSquatCount(ryanValues[0].TotalSquatSum);

      setSeanPushupCount(seanValues[0].TotalPushupSum);
      setSeanPullupCount(seanValues[0].TotalPullupSum);
      setSeanSquatCount(seanValues[0].TotalSquatSum);

      setJeffPushupCount(jeffValues[0].TotalPushupSum);
      setJeffPullupCount(jeffValues[0].TotalPullupSum);
      setJeffSquatCount(jeffValues[0].TotalSquatSum);

      setEricPushupCount(ericValues[0].TotalPushupSum);
      setEricPullupCount(ericValues[0].TotalPullupSum);
      setEricSquatCount(ericValues[0].TotalSquatSum);

      setAshleyPushupCount(ashleyValues[0].TotalPushupSum);
      setAshleyPullupCount(ashleyValues[0].TotalPullupSum);
      setAshleySquatCount(ashleyValues[0].TotalSquatSum);

      setJessiePushupCount(jessieValues[0].TotalPushupSum);
      setJessiePullupCount(jessieValues[0].TotalPullupSum);
      setJessieSquatCount(jessieValues[0].TotalSquatSum);

      setNoraPushupCount(noraValues[0].TotalPushupSum);
      setNoraPullupCount(noraValues[0].TotalPullupSum);
      setNoraSquatCount(noraValues[0].TotalSquatSum);

      setIsLoading(false);
    }

  }, [myPushupList]);

  useEffect(() => {
    //
  }, [ryanPushupCount, seanPushupCount]);

  // Get base data from Google Sheets
  useEffect(() => {

    // getIPAddress();

    // if (!evaluator) {
    //   setShowError(true);
    //   setErrorMessage('there appears to be required information missing to process this request.');
    //   setEvaluatorFromParam(false);
    //   return;
    // }

    setEvaluatorFromParam(true);

    setLoadingMessage('Loading Workout Data');

    getData();
    //getEvaluationGoogleSheet();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  // IsLoading changing
  useEffect(() => {

  }, [isLoading]);

  useEffect(() => {
    // console.log("Show Error: " + showError);
  }, [showError]);

  useEffect(() => {

    if (shouldAutoCalc) {
      if (pullupCount > 0) {
        setPushupCount(pullupCount * 2);
        setSquatCount(pullupCount * 4);
      } else {
        setPullupCount(0);
        setPushupCount(0);
        setSquatCount(0);
      }
    }
  }, [pullupCount, pushupCount, squatCount]);

  // Ensure a positive integer is entered
  const isPositiveInteger = (val) => {
    let str = String(val);
    str = str.trim();
    if (!str) {
      return false;
    }
    str = str.replace(/^0+/, "") || "0";
    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  }

  // Cell Editing Complete - fire
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      case 'SkatingAbility':
      case 'Passing':
      case 'Shooting':
      case 'PuckControl_StickHandling':
      case 'ScoringAbility':
      case 'PlayMakingAbility':
      case 'PositionalPlay':
      case 'SupportsPuckCarrier':
      case 'TeamPlay':
      case 'Intensity_Agressiveness':
      case 'Coachability_Attitude':
        if (isPositiveInteger(newValue))
          rowData[field] = newValue;
        else
          event.preventDefault();
        break;
      case 'Notes':
        rowData[field] = newValue;
        break;
      case "Regular_Attendence":
        rowData[field] = newValue;
        break;

      default:
        if (newValue.trim().length > 0)
          rowData[field] = newValue;
        else
          event.preventDefault();
        break;
    }

    // save to local storage
    // fill with values
    // localData.teamData = teamPlayerEvalList;
    // save ... 
    // localStorage.setItem(evaluator, JSON.stringify(localData));
  }

  function addRyanData() {
    console.log('Adding for Ryan');
    setPushupsPlayer('Ryan');
    setVisibleLeft(true);
  }

  function addSeanData() {
    console.log('Adding for Sean');
    setPushupsPlayer('Sean');
    setVisibleLeft(true);
  }

  function addJeffData() {
    console.log('Adding for Jeff');
    setPushupsPlayer('Jeff');
    setVisibleLeft(true);
  }

  function addEricData() {
    console.log('Adding for Eric');
    setPushupsPlayer('Eric');
    setVisibleLeft(true);
  }

  function addAshleyData() {
    console.log('Adding for Ashley');
    setPushupsPlayer('Ashley');
    setVisibleLeft(true);
  }

  function addJessieData() {
    console.log('Adding for Jessie');
    setPushupsPlayer('Jessie');
    setVisibleLeft(true);
  }

  function addNoraData() {
    console.log('Adding for Nora');
    setPushupsPlayer('Nora');
    setVisibleLeft(true);
  }

  // Submit form
  async function handleSubmitClick() {
    console.log('submitting')
    await addEvalRow();
  }

  // Create Google Sheet Row and Submit
  async function addEvalRow() {

    var submitDate = new Date();

    console.log(submitDate.toLocaleString());
    console.log(submitDate.toLocaleDateString());

    const dataSheet = pushUpDoc.sheetsByIndex[1];
    var entry = {
      Name: pushupsPlayer,
      Timestamp: submitDate.toLocaleString(),
      Date: submitDate.toLocaleDateString(),
      NumOfPushups: pushupCount,
      NumOfPullUps: pullupCount,
      NumOfSquats: squatCount
    };

    // console.log(entry);
    await dataSheet.addRow(entry);


    setPushupsPlayer('');
    setVisibleLeft(false);
    setPullupCount(0);
    setPushupCount(0);
    setSquatCount(0);


    getData();
  }

  const cellEditor = (options) => {
    if (options.field === 'FirstName' || options.field === 'LastName')
      return readonlyEditor(options);
    else if (options.field === 'Position')
      return textEditor(options);
    else if (options.field === 'Notes') {
      return textAreaEditor(options);
    }
    else if (options.field === 'Regular_Attendence') {
      return checkboxEditor(options);
    }
    else
      return numberEditor(options);
  }

  const readonlyEditor = (options) => {
    return <InputText type="text" value={options.value} readOnly />;
  }

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  }

  const textAreaEditor = (options) => {
    return <InputTextarea value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  }

  const numberEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} min={1} max={5} locale="en-US" />
  }

  const checkboxEditor = (options) => {
    return <ToggleButton checked={(options.value)} onChange={(e) => options.editorCallback(e.value)} onIcon="pi pi-check" offIcon="pi pi-times" aria-label="Confirmation" />
  }

  const regAttendenceBodyTemplate = (rowData) => {
    if (rowData.Regular_Attendence) {
      return <Tag className="mr-2" style={{ cursor: 'pointer' }} severity="success" value="Yes"></Tag>
    }
    else {
      return <Tag className="mr-2" style={{ cursor: 'pointer' }} severity="danger" value="No"></Tag>
    }
  }

  const notesBodyTemplate = (rowData) => {

    if (rowData.Notes && rowData.Notes.length > 0) {
      return <i className="custom-target-icon pi pi-book" style={{ cursor: 'pointer' }} title={rowData.Notes}></i>
    }
    else {
      return <i className="custom-target-icon pi pi-pencil" style={{ cursor: 'pointer' }} title="Click to add notes"></i>
    }
  }

  // TOAST MESSAGES
  const showSuccess = () => {
    toast.current.show({ severity: 'success', summary: 'Submitted Successfully', detail: 'Your evaluation has been submitted successfully', life: 3000 });
  }

  const reject = () => {
    // console.log('reject')
    setPushupsPlayer('');
    setVisibleLeft(false);
    // toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }

  const onSetPullupCount = () => {
    if (pullupCount > 0) {
      setPushupCount(pullupCount * 2);
      setSquatCount(pullupCount * 4);
    } else {
      setPullupCount(0);
      setPushupCount(0);
      setSquatCount(0);
    }
  }

  const showSuccessToast = (summaryString, detailString) => {
    toast.current.show({ severity: 'success', summary: summaryString, detail: detailString, life: 3000 });
  }

  const showEvaluatorNameSave = () => {
    toast.current.show({ severity: 'success', summary: 'Info Saved', detail: 'Your evaluator information has saved!', life: 3000 });
  }

  const showEvaluatorNameError = () => {
    toast.current.show({ severity: 'error', summary: 'Please enter value', detail: 'You need to supply a name!', life: 3000 });
  }

  // Confirmation Dialog for Submitting Data
  const confirmSubmit = () => {
    confirmDialog({
      message: 'Are you sure you are ready to submit? This is final ...',
      header: 'Finished?',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleSubmitClick(),
      reject: () => reject()
    });
  }

  return (

    <div className="App">
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src={logo} alt="logo" height="80px" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              {/* <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>

      <Sidebar visible={visibleLeft} onHide={() => setVisibleLeft(false)}>
        <div style={{ textAlign: 'center' }}>

          Should auto calculate pushups and squats from pullups? <Checkbox onChange={e => setShouldAutoCalc(e.checked)} checked={shouldAutoCalc}></Checkbox>

          <hr />

          <h3>Add Pullups for {pushupsPlayer}</h3>
          How Many?<br />
          <InputNumber inputId="vertical" value={pullupCount} onValueChange={(e) => setPullupCount(e.value)} showButtons buttonLayout="vertical" style={{ width: '4rem' }}
            decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />

          <h3>Pushups</h3><br />
          <InputNumber inputId="vertical" disabled={shouldAutoCalc} value={pushupCount} onValueChange={(e) => setPushupCount(e.value)} showButtons buttonLayout="vertical" style={{ width: '4rem' }}
            decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />

          <h3>Squats</h3><br />
          <InputNumber inputId="vertical" disabled={shouldAutoCalc} value={squatCount} onValueChange={(e) => setSquatCount(e.value)} showButtons buttonLayout="vertical" style={{ width: '4rem' }}
            decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
          <hr />
          <Button id='btnSubmit' className='p-button-danger' label="Submit" onClick={confirmSubmit} />
        </div>
      </Sidebar>

      <ConfirmDialog />
      <div hidden={!isLoading} style={{ textAlign: 'center' }}>
        <ProgressSpinner /><br />
        <span>{loadingMessage}</span>
      </div>
      <Toast ref={toast} />

      <div className="card" hidden={showError} style={{ backgroundColor: "#F2F2F3" }}>

        <img src={newLogo} alt="logo" width="600px" style={{ alignSelf: "center" }} />

        <TabView>
          <TabPanel header="Men (Big Dumb Animals)">
            <div className="card">
              <div className="card-container green-container overflow-hidden">
                <div className="flex flex-wrap">
                  <div className="flex-auto flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 px-5 py-3 border-round" style={{ position: 'relative' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p>Ryan</p>
                      <img src={RyanPic} className="border-solid border-900 border-circle" alt="Ryan" width="200px" />

                      <div className="flex flex-wrap">
                        <WorkoutActivity activityCount={ryanPullupCount} activityName="Pullups" />
                        <WorkoutActivity activityCount={ryanPushupCount} activityName="Pushups" />
                        <WorkoutActivity activityCount={ryanSquatCount} activityName="Squats" />
                      </div>

                    </div>
                    <Button icon="pi pi-plus" onClickCapture={addRyanData} className="p-button-rounded p-button-warning" style={{ position: 'absolute', top: '4px', right: '4px' }} aria-label="Add for Ryan" />
                  </div>
                  <div className="flex-auto flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 px-5 py-3 border-round" style={{ position: 'relative' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p>Sean</p>
                      <img src={SeanPic} className="border-solid border-900 border-circle" alt="Sean" width="200px" />

                      <div className="flex flex-wrap">
                        <WorkoutActivity activityCount={seanPullupCount} activityName="Pullups" />
                        <WorkoutActivity activityCount={seanPushupCount} activityName="Pushups" />
                        <WorkoutActivity activityCount={seanSquatCount} activityName="Squats" />
                      </div>
                    </div>
                    <Button icon="pi pi-plus" onClickCapture={addSeanData} className="p-button-rounded p-button-warning" style={{ position: 'absolute', top: '4px', right: '4px' }} aria-label="Add for Sean" />
                  </div>

                  <div className="flex-auto flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 px-5 py-3 border-round" style={{ position: 'relative' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p>Jeff</p>
                      <img src={JeffPic} className="border-solid border-900 border-circle" alt="Jeff" width="200px" />

                      <div className="flex flex-wrap">
                        <WorkoutActivity activityCount={jeffPullupCount} activityName="Pullups" />
                        <WorkoutActivity activityCount={jeffPushupCount} activityName="Pushups" />
                        <WorkoutActivity activityCount={jeffSquatCount} activityName="Squats" />
                      </div>
                    </div>
                    <Button icon="pi pi-plus" onClickCapture={addJeffData} className="p-button-rounded p-button-warning" style={{ position: 'absolute', top: '4px', right: '4px' }} aria-label="Add for Sean" />
                  </div>

                  <div className="flex-auto flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 px-5 py-3 border-round" style={{ position: 'relative' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p>Eric</p>
                      <img src={EricPic} className="border-solid border-900 border-circle" alt="Eric" width="200px" />

                      <div className="flex flex-wrap">
                        <WorkoutActivity activityCount={ericPullupCount} activityName="Pullups" />
                        <WorkoutActivity activityCount={ericPushupCount} activityName="Pushups" />
                        <WorkoutActivity activityCount={ericSquatCount} activityName="Squats" />
                      </div>
                    </div>
                    <Button icon="pi pi-plus" onClickCapture={addEricData} className="p-button-rounded p-button-warning" style={{ position: 'absolute', top: '4px', right: '4px' }} aria-label="Add for Sean" />
                  </div>

                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Boss Ladies">
            <div className="card">
              <div className="card-container green-container overflow-hidden">
                <div className="flex flex-wrap">
                  <div className="flex-auto flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 px-5 py-3 border-round" style={{ position: 'relative' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p>Ashley</p>
                      <img src={AshleyPic} className="border-solid border-900 border-circle" alt="Ryan" width="200px" />

                      <div className="flex flex-wrap">
                        <WorkoutActivity activityCount={ashleyPullupCount} activityName="Pullups" />
                        <WorkoutActivity activityCount={ashleyPushupCount} activityName="Pushups" />
                        <WorkoutActivity activityCount={ashleySquatCount} activityName="Squats" />
                      </div>

                    </div>
                    <Button icon="pi pi-plus" onClickCapture={addAshleyData} className="p-button-rounded p-button-warning" style={{ position: 'absolute', top: '4px', right: '4px' }} aria-label="Add for Ryan" />
                  </div>
                  <div className="flex-auto flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 px-5 py-3 border-round" style={{ position: 'relative' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p>Jessie</p>
                      <img src={JessiePic} className="border-solid border-900 border-circle" alt="Sean" width="200px" />

                      <div className="flex flex-wrap">
                        <WorkoutActivity activityCount={jessiePullupCount} activityName="Pullups" />
                        <WorkoutActivity activityCount={jessiePushupCount} activityName="Pushups" />
                        <WorkoutActivity activityCount={jessieSquatCount} activityName="Squats" />
                      </div>
                    </div>
                    <Button icon="pi pi-plus" onClickCapture={addJessieData} className="p-button-rounded p-button-warning" style={{ position: 'absolute', top: '4px', right: '4px' }} aria-label="Add for Sean" />
                  </div>

                  <div className="flex-auto flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 px-5 py-3 border-round" style={{ position: 'relative' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p>Nora</p>
                      <img src={NoraPic} className="border-solid border-900 border-circle" alt="Sean" width="200px" />

                      <div className="flex flex-wrap">
                        <WorkoutActivity activityCount={noraPullupCount} activityName="Pullups" />
                        <WorkoutActivity activityCount={noraPushupCount} activityName="Pushups" />
                        <WorkoutActivity activityCount={noraSquatCount} activityName="Squats" />
                      </div>
                    </div>
                    <Button icon="pi pi-plus" onClickCapture={addNoraData} className="p-button-rounded p-button-warning" style={{ position: 'absolute', top: '4px', right: '4px' }} aria-label="Add for Sean" />
                  </div>

                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Kids">
            <p className="m-0">
              If any are brave enough
            </p>
          </TabPanel>
        </TabView>

        {/* <DataTable value={myPushupList} editMode="cell" className="editable-cells-table" responsiveLayout="scroll">
          {
            columns.map(({ field, header }) => {
              return <Column key={field} field={field} header={header} style={{ width: '8%' }} body={(field === 'Notes' && notesBodyTemplate) || (field === 'Regular_Attendence' && regAttendenceBodyTemplate)}
                editor={(options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} />
            })
          }
        </DataTable> */}
      </div>

      <div className="alert alert-danger" role="alert" style={{ width: '60%', minWidth: '400px', margin: 'auto', padding: '10px' }} hidden={!showError}>
        <img src={errorLogo} width="50px" style={{ float: 'left', marginRight: '10px' }} />
        <span style={{ fontWeight: 'bold' }}>We're sorry</span> - {errorMessage}  Please contact johnstownwarriorstreasurer@gmail.com with questions or support items.
      </div>
    </div>
  );
}

export default App;