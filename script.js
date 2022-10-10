let addbtn = document.querySelector('.addbtn')
let rmvbtn = document.querySelector('.rmvbtn')
let modal = document.querySelector('.modal')
let main = document.querySelector('.main-cont')
let notes = document.querySelector('.notes')

let allPrioColor = document.querySelectorAll('.colors')
let color = ['lightgreen', 'lightpink', 'lightblue', 'black']
let modalprioritycolor = color[0]

let flag = false
let remFlag = false

let ticketArr = []

let toolboxColor = document.querySelectorAll('.color')

if (localStorage.getItem('jira tickets')) {
  ticketArr = JSON.parse(localStorage.getItem('jira tickets'))

  ticketArr.forEach((tiobj) => {
    createTicket(tiobj.ticketcolor, tiobj.ticketTask, tiobj.ticketid)
  })
}

toolboxColor.forEach((element) => {
  element.addEventListener('click', (e) => {
    let wantColor = element.classList[1]
    let filterTickets = ticketArr.filter((ticketobj, idx) => {
      return wantColor === ticketobj.ticketcolor
    })
    let allTickets = document.querySelectorAll('.ticket')
    allTickets.forEach((element) => {
      element.remove()
    })
    filterTickets.forEach((ticketobj, idx) => {
      createTicket(
        ticketobj.ticketcolor,
        ticketobj.ticketTask,
        ticketobj.ticketid,
      )
    })
  })

  element.addEventListener('dblclick', (e) => {
    let allTickets = document.querySelectorAll('.ticket')
    allTickets.forEach((element) => {
      element.remove()
    })
    ticketArr.forEach((ticketobj, idx) => {
      createTicket(
        ticketobj.ticketcolor,
        ticketobj.ticketTask,
        ticketobj.ticketid,
      )
    })
  })
})

for (let i = 0; allPrioColor.length > i; i++) {
  allPrioColor[i].addEventListener('click', (e) => {
    for (let i = 0; allPrioColor.length > i; i++) {
      allPrioColor[i].classList.remove('border')
    }
    allPrioColor[i].classList.add('border')
    modalprioritycolor = allPrioColor[i].classList[1]
  })
}

rmvbtn.addEventListener('click', (e) => {
  remFlag = !remFlag
})
addbtn.addEventListener('click', (e) => {
  // display modal
  // generate ticket
  flag = !flag
  if (flag) {
    modal.style.display = 'flex'
  } else modal.style.display = 'none'
})

modal.addEventListener('keydown', (e) => {
  let key = e.key
  if (key === 'Shift') {
    flag = false
    createTicket(modalprioritycolor, notes.value)
    modal.style.display = 'none'
    notes.value = ''
  }
})
function createTicket(ticketcolor, ticketTask, ticketid) {
  let id = ticketid || shortid()
  let ticket = document.createElement('div')
  ticket.setAttribute('class', 'ticket')
  ticket.innerHTML = `
        <div class="ticketcolor ${ticketcolor}"></div>
        <div class="ticketid">#${id}</div>
        <div class="taskarea">${ticketTask}
        </div>
        <div class="lock"><i class="fa-solid fa-lock"></i></div>
    `
  main.appendChild(ticket)

  if (!ticketid) {
    ticketArr.push({ ticketcolor, ticketid: id, ticketTask })
  }
  localStorage.setItem('jira tickets', JSON.stringify(ticketArr))
  handler(ticket, id)
  handlremove(ticket, id)
  handelcolor(ticket, id)
}
function handlremove(ticket, id) {
  ticket.addEventListener('click', (e) => {
    if (remFlag) {
      let idx = getTicketidx(id)
      ticketArr.splice(idx, 1)
      localStorage.setItem('jira tickets', JSON.stringify(ticketArr))
      ticket.remove()
    }
  })
}
let lockclass = 'fa-lock'
let unlockclass = 'fa-unlock'

function handler(ticket, id) {
  let tkt = ticket.querySelector('.lock')
  let tktlock = tkt.children[0]
  let edi = ticket.querySelector('.taskarea')
  tktlock.addEventListener('click', (e) => {
    let tidx = getTicketidx(id)
    if (tktlock.classList.contains(lockclass)) {
      tktlock.classList.remove(lockclass)
      tktlock.classList.add(unlockclass)
      edi.setAttribute('contenteditable', true)
    } else {
      tktlock.classList.remove(unlockclass)
      tktlock.classList.add(lockclass)
      edi.setAttribute('contenteditable', false)
    }

    // MODIFY DATA IN LOCAL STORAGE (TASK)
    ticketArr[tidx].ticketTask = edi.innerText
    localStorage.setItem('jira tickets', JSON.stringify(ticketArr))
  })
}
function handelcolor(ticket, id) {
  let hello = ticket.querySelector('.ticketcolor')
  hello.addEventListener('click', (e) => {
    let ticketidx = getTicketidx(id)

    let helIndex = hello.classList[1]

    let currentindex = color.findIndex((ele) => {
      return ele === helIndex
    })

    currentindex++
    currentindex = currentindex % color.length

    hello.classList.remove(helIndex)
    hello.classList.add(color[currentindex])

    ticketArr[ticketidx].ticketcolor = color[currentindex]
    localStorage.setItem('jira tickets', JSON.stringify(ticketArr))
  })
}

function getTicketidx(id) {
  let ticketidx = ticketArr.findIndex((ticketobj) => {
    return ticketobj.ticketid === id
  })

  return ticketidx
}
