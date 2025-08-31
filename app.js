// ========== GLOBAL DATA ==========
const students = [
  "Aanya","Alaiza","Anika","Hazel","Medhna","Simone",
  "Aaditya","Aaron","Ahrish","Atharva","Dharmendar","Dvij","Maayin",
  "Rishaan","Rohan","Sehejveer","Shaurya P.","Shaurya T.","Vedh","Vir","Vishwas"
];

const subjects = [
  "English Language","2L","Mathematics",
  "Science: Biology","Science: Chemistry","Science: Physics",
  "Social Science: History and Political Science","Social Science: Geography","Social Science: Economics",
  "Computer Science","Interactive Marathi"
];

// Storage
let marksData = JSON.parse(localStorage.getItem("marksData")||"[]");
let attendanceData = JSON.parse(localStorage.getItem("attendanceData")||"[]");
let assignmentsData = JSON.parse(localStorage.getItem("assignmentsData")||"[]");
let circularsData = JSON.parse(localStorage.getItem("circularsData")||"[]");
let complaintsData = JSON.parse(localStorage.getItem("complaintsData")||"[]");
let mailsData = JSON.parse(localStorage.getItem("mailsData")||"[]");
let eventsData = JSON.parse(localStorage.getItem("eventsData")||"[]");

// ========== NAVIGATION ==========
document.querySelectorAll(".nav-link").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".view").forEach(v=>v.classList.remove("show"));
    document.querySelectorAll(".nav-link").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("view-"+btn.dataset.view).classList.add("show");
  });
});

// ========== INIT DROPDOWNS ==========
function fillDropdown(id, arr){
  const sel=document.getElementById(id);
  if(!sel) return;
  sel.innerHTML = "";
  arr.forEach(v=>{
    const opt=document.createElement("option");
    opt.value=v; opt.textContent=v;
    sel.appendChild(opt);
  });
}
fillDropdown("marksStudent", students);
fillDropdown("marksSubject", subjects);
fillDropdown("asSubject", subjects);
fillDropdown("compStudent", students);
fillDropdown("reportStudent", students);

// ========== MARKS ENTRY ==========
const marksTableBody = document.querySelector("#marksTable tbody");

function renderMarks(){
  marksTableBody.innerHTML = "";
  marksData.forEach(m=>{
    const tr=document.createElement("tr");
    tr.innerHTML = `
      <td>${m.student}</td>
      <td>${m.subject}</td>
      <td>${m.semester}</td>
      <td>${m.assessment}${m.assessment==="Multiple Assessment" && m.subcat?` (${m.subcat})`:""}</td>
      <td>${m.title}</td>
      <td>${m.score}</td>
      <td>${m.outOf}</td>
      <td>${m.comment||""}</td>
    `;
    marksTableBody.appendChild(tr);
  });
  localStorage.setItem("marksData",JSON.stringify(marksData));
  updateStats();
}

// Show/hide MA subcategory
document.getElementById("marksAssessment").addEventListener("change",e=>{
  if(e.target.value==="Multiple Assessment"){
    document.getElementById("maSubLabel").style.display="block";
    document.getElementById("marksMASub").style.display="block";
  } else {
    document.getElementById("maSubLabel").style.display="none";
    document.getElementById("marksMASub").style.display="none";
  }
});

// Save mark
document.getElementById("saveMarkBtn").addEventListener("click",()=>{
  const student=document.getElementById("marksStudent").value;
  const subject=document.getElementById("marksSubject").value;
  const semester=document.getElementById("marksSemester").value;
  const assessment=document.getElementById("marksAssessment").value;
  const subcat=document.getElementById("marksMASub").value.trim();
  const title=document.getElementById("marksTitle").value.trim();
  const score=parseFloat(document.getElementById("marksScore").value);
  const outOf=parseFloat(document.getElementById("marksOutOf").value);
  const comment=document.getElementById("marksComment").value.trim();

  if(!title||isNaN(score)||isNaN(outOf)) return alert("Please complete all fields");

  marksData.push({student,subject,semester,assessment,subcat,title,score,outOf,comment});
  renderMarks();

  // clear form
  document.getElementById("marksTitle").value="";
  document.getElementById("marksScore").value="";
  document.getElementById("marksOutOf").value="10";
  document.getElementById("marksComment").value="";
  document.getElementById("marksMASub").value="";
});

renderMarks();

// ========== ATTENDANCE ==========
const attTableBody=document.querySelector("#attTable tbody");
const attRecordsBody=document.querySelector("#attRecords tbody");

function renderAttendanceTable(){
  attTableBody.innerHTML="";
  students.forEach(st=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`
      <td>${st}</td>
      <td>
        <select class="att1">
          <option>Present</option>
          <option>Absent</option>
          <option>Event/Excursion</option>
          <option>Online</option>
        </select>
      </td>
      <td>
        <select class="att2">
          <option>Present</option>
          <option>Absent</option>
          <option>Event/Excursion</option>
          <option>Online</option>
        </select>
      </td>
    `;
    attTableBody.appendChild(tr);
  });
}
renderAttendanceTable();

function renderAttendanceRecords(){
  attRecordsBody.innerHTML="";
  attendanceData.forEach(a=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${a.date}</td><td>${a.working}</td>
                  <td>${a.student}</td><td>${a.first}</td><td>${a.second}</td>`;
    attRecordsBody.appendChild(tr);
  });
}
renderAttendanceRecords();

document.getElementById("saveAttendanceBtn").addEventListener("click",()=>{
  const date=document.getElementById("attDate").value;
  const working=document.getElementById("attWorking").value;
  if(!date) return alert("Pick a date");
  if(working==="no"){
    attendanceData.push({date,working,student:"-",first:"-",second:"-"});
  } else {
    [...attTableBody.querySelectorAll("tr")].forEach((row,i)=>{
      const first=row.querySelector(".att1").value;
      const second=row.querySelector(".att2").value;
      attendanceData.push({date,working,student:students[i],first,second});
    });
  }
  localStorage.setItem("attendanceData",JSON.stringify(attendanceData));
  renderAttendanceRecords();
  alert("Attendance Saved!");
});

// ========== ASSIGNMENTS ==========
const asTableBody=document.querySelector("#asTable tbody");

function renderAssignments(){
  asTableBody.innerHTML="";
  assignmentsData.forEach(a=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${a.sub}</td><td>${a.title}</td><td>${a.desc}</td>
                  <td>${a.due}</td><td>${a.fileName||""}</td>`;
    asTableBody.appendChild(tr);
  });
  localStorage.setItem("assignmentsData",JSON.stringify(assignmentsData));
  updateStats();
}
renderAssignments();

document.getElementById("saveAssignment").addEventListener("click",()=>{
  const sub=document.getElementById("asSubject").value;
  const title=document.getElementById("asTitle").value.trim();
  const desc=document.getElementById("asDescription").value.trim();
  const due=document.getElementById("asDueDate").value;
  const file=document.getElementById("asFile");
  const fileName=file.files.length?file.files[0].name:"";
  if(!sub||!title) return alert("Fill subject & title");
  assignmentsData.push({sub,title,desc,due,fileName});
  renderAssignments();
  document.getElementById("asTitle").value="";
  document.getElementById("asDescription").value="";
  document.getElementById("asDueDate").value="";
  file.value="";
});

// ========== CALENDAR ==========
const cal=document.getElementById("calendar");

function renderCalendar(){
  cal.innerHTML="";
  eventsData.forEach(e=>{
    const div=document.createElement("div");
    div.style.border="1px solid var(--border)";
    div.style.margin="6px";div.style.padding="6px";div.style.borderRadius="6px";
    div.innerHTML=`<b>${e.date}</b> - ${e.title}<br><small>${e.desc}</small>`;
    cal.appendChild(div);
  });
}
renderCalendar();

document.getElementById("saveEventBtn").addEventListener("click",()=>{
  const title=document.getElementById("calTitle").value.trim();
  const date=document.getElementById("calDate").value;
  const desc=document.getElementById("calDesc").value.trim();
  if(!title||!date) return alert("Fill title & date");
  eventsData.push({title,date,desc});
  localStorage.setItem("eventsData",JSON.stringify(eventsData));
  renderCalendar();
  document.getElementById("calTitle").value="";
  document.getElementById("calDate").value="";
  document.getElementById("calDesc").value="";
});

// ========== CIRCULARS ==========
const circBody=document.querySelector("#circularsTable tbody");

function renderCirculars(){
  circBody.innerHTML="";
  circularsData.forEach(c=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${c.title}</td><td>${c.date}</td><td>${c.desc}</td><td>${c.file||""}</td>`;
    circBody.appendChild(tr);
  });
  localStorage.setItem("circularsData",JSON.stringify(circularsData));
  updateStats();
}
renderCirculars();

document.getElementById("saveCircularBtn").addEventListener("click",()=>{
  const title=document.getElementById("circTitle").value.trim();
  const desc=document.getElementById("circDesc").value.trim();
  const date=document.getElementById("circDate").value;
  const file=document.getElementById("circFile");
  const fileName=file.files.length?file.files[0].name:"";
  if(!title||!date) return alert("Fill title & date");
  circularsData.push({title,desc,date,file:fileName});
  renderCirculars();
  document.getElementById("circTitle").value="";
  document.getElementById("circDesc").value="";
  document.getElementById("circDate").value="";
  file.value="";
});

// ========== COMPLAINTS ==========
const compBody=document.querySelector("#compTable tbody");
function renderComplaints(){
  compBody.innerHTML="";
  complaintsData.forEach(c=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${c.student}</td><td>${c.text}</td>`;
    compBody.appendChild(tr);
  });
  localStorage.setItem("complaintsData",JSON.stringify(complaintsData));
}
renderComplaints();

document.getElementById("saveComplaintBtn").addEventListener("click",()=>{
  const student=document.getElementById("compStudent").value;
  const text=document.getElementById("compText").value.trim();
  if(!text) return alert("Write complaint");
  complaintsData.push({student,text});
  renderComplaints();
  document.getElementById("compText").value="";
});

// ========== MAIL ==========
const mailBody=document.querySelector("#mailTable tbody");
function renderMails(){
  mailBody.innerHTML="";
  mailsData.forEach(m=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${m.to}</td><td>${m.sub}</td><td>${m.msg}</td>`;
    mailBody.appendChild(tr);
  });
  localStorage.setItem("mailsData",JSON.stringify(mailsData));
}
renderMails();

document.getElementById("sendMailBtn").addEventListener("click",()=>{
  const to=document.getElementById("mailTo").value.trim();
  const sub=document.getElementById("mailSubject").value.trim();
  const msg=document.getElementById("mailBody").value.trim();
  if(!to||!sub||!msg) return alert("Fill all fields");
  mailsData.push({to,sub,msg});
  renderMails();
  document.getElementById("mailTo").value="";
  document.getElementById("mailSubject").value="";
  document.getElementById("mailBody").value="";
});

// ========== DASHBOARD STATS ==========
function updateStats(){
  document.getElementById("statStudents").textContent=students.length;
  document.getElementById("statSubjects").textContent=subjects.length;
  document.getElementById("statMarks").textContent=marksData.length;
  document.getElementById("statAssignments").textContent=assignmentsData.length;
  document.getElementById("statCirculars").textContent=circularsData.length;
}
updateStats();

// ========== REPORT CARDS ==========
function getGrade(percent){
  if(percent>=90) return "A*";
  if(percent>=80) return "A";
  if(percent>=70) return "B";
  if(percent>=60) return "C";
  if(percent>=50) return "D";
  if(percent>=40) return "E";
  return "U";
}

document.getElementById("generateReportBtn").addEventListener("click",()=>{
  const student=document.getElementById("reportStudent").value;
  const sem=document.getElementById("reportSemester").value;
  const reportArea=document.getElementById("reportCardArea");
  reportArea.innerHTML="";

  let overallGot=0, overallTotal=0;

  const table=document.createElement("table");
  table.innerHTML="<thead><tr><th>Subject</th><th>Avg %</th><th>Grade</th><th>Comments</th></tr></thead>";
  const tb=document.createElement("tbody");

  subjects.forEach(sub=>{
    const subjMarks=marksData.filter(m=>m.student===student&&m.subject===sub&&m.semester===sem);
    if(subjMarks.length>0){
      let total=0,got=0,comments=[];
      subjMarks.forEach(m=>{got+=m.score;total+=m.outOf;if(m.comment)comments.push(m.comment);});
      overallGot+=got; overallTotal+=total;
      const percent=(got/total)*100;
      const tr=document.createElement("tr");
      tr.innerHTML=`<td>${sub}</td><td>${percent.toFixed(2)}%</td><td>${getGrade(percent)}</td><td>${comments.join("; ")}</td>`;
      tb.appendChild(tr);
    }
  });

  table.appendChild(tb);
  reportArea.appendChild(table);

  if(overallTotal>0){
    const overall=(overallGot/overallTotal)*100;
    const p=document.createElement("p");
    p.textContent=`Overall: ${overall.toFixed(2)}% (${getGrade(overall)})`;
    reportArea.appendChild(p);
  }

  // Download as PDF (simple print-to-pdf style)
  const btn=document.createElement("button");
  btn.textContent="Download PDF";
  btn.className="btn secondary";
  btn.addEventListener("click",()=>{
    const printWindow=window.open("","PRINT","height=650,width=900");
    printWindow.document.write(`<html><head><title>Report Card</title></head><body>${reportArea.innerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  });
  reportArea.appendChild(btn);
});

// ========== SETTINGS ==========
document.getElementById("saveSettingsBtn").addEventListener("click",()=>{
  localStorage.setItem("teacherName",document.getElementById("teacherName").value);
  localStorage.setItem("teacherEmail",document.getElementById("teacherEmail").value);
  alert("Settings Saved!");
});

// ========== RESET ==========
document.getElementById("resetBtn").addEventListener("click",()=>{
  if(confirm("Clear all data?")){
    localStorage.clear();
    location.reload();
  }
});
