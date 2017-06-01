import { createSelector } from 'reselect'
import { filterTeachersByString, filterTeachersByCategory } from '../helpers/utils'
import { getVotesPercentage, getStats, getAvg } from '../helpers/analytics'

const questions = (state) => state.data.questions
const teachers = (state) => state.data.teachers
const search = (state) => state.filters.search
const cls = (state) => state.filters.cls
const schoolVotes = (state) => state.data.schoolVotes || []
const teacherData = (state) => state.teacherData
const votes = (state) => state.data.votes || []

export const currentTeachers = createSelector(
  teachers,
  search,
  cls,
  (teachers, search, cls) => cls ? filterTeachersByCategory(filterTeachersByString(teachers, search), cls) : filterTeachersByString(teachers, search)
)

export const barData = createSelector(
  schoolVotes,
  teacherData,
  (schoolVotes, teacherData) => {
    const schoolData = schoolVotes.map(item => item.goodVotesPercentage).slice(0, 12)
    getVotesPercentage(teacherData.valutazione, 4)
    const profData = teacherData.valutazione.map(item => item.goodVotesPercentage).slice(0, 12)
    return ({
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      datasets: [
        {
          label: 'Voto del Docente',
          data: profData,
          fillColor: '#1D73AA',
          borderWidth: 1
        },
        {
          label: 'Media Scuola',
          data: schoolData,
          fillColor: '#C44441',
          borderWidth: 1
        },

      ]
    })
  }
)

export const lineData = createSelector(
  schoolVotes,
  teacherData,
  (schoolVotes, teacherData) => {

    if (teacherData.valutazione.length > 0) {
      teacherData.valutazione.map(valutazione => {
        const { countVal } = valutazione
        for (var i = 1; i <= 5; i++) {
          let temp = true
          countVal.map(val => {
            if (val.value !== i && countVal.length < 5 && temp) {
              valutazione.countVal.push({ value: i, count: 0 })
              temp = false
            }
          })
        }
        countVal.sort((item1, item2) => item1.value > item2.value)
      })
      console.log(teacherData.valutazione[0].countVal)
    }

    

    const schoolData = schoolVotes.map(item => item.goodVotesPercentage).slice(0, 12)
    const firstQuestion = teacherData.valutazione.length > 0 ? teacherData.valutazione[11].countVal.map(item => item.count) : []

    getVotesPercentage(teacherData.valutazione, 4)
    const profData = teacherData.valutazione.map(item => item.goodVotesPercentage).slice(0, 12)
    return ({
      datasets: {
        labels: ["1", "2", "3", "4", "5"],
        datasets: [
          {
            label: 'Voto del Docente',
            data: firstQuestion,
            borderColor: '#1D73AA',
            pointBackgroundColor: '#1D73AA',
            fillColor: '#99ff99',
            fill: false,
            showLine: false,
            borderWidth: 1
          }
        ]
      },
      valutazioni: firstQuestion
    })
  }
)

export const tableData = createSelector(
  schoolVotes,
  teacherData,
  questions,
  (schoolVotes, teacherData, questions) => {
    const schoolData = schoolVotes.map(item => item.goodVotesPercentage).slice(0, 12)
    getVotesPercentage(teacherData.valutazione, 4)
    const profData = teacherData.valutazione.map(item => item.goodVotesPercentage).slice(0, 12)
    return schoolData.map((item, i) => {
      return {
        question: questions[i],
        idDomanda: i,
        goodVotesPercentage: profData[i],
        schoolPercentage: item,
        difference: (Math.round(profData[i] - item) || 0)
      }
    })
  })

export const teacherStats = createSelector(
  teacherData,
  (teacherData) => {
    getVotesPercentage(teacherData.valutazione, 4)
    const profData = teacherData.valutazione.map(item => item.goodVotesPercentage).slice(0, 12)
    return getStats(profData)
  })

export const overViewData = createSelector(
  schoolVotes,
  votes,
  (schoolVotes, votes) => {
    const schoolAvg = getAvg(schoolVotes.map(item => item.goodVotesPercentage).slice(0, 12))
    votes.shift()
    return votes.map((item) => {
      return {
        nomeDocente: item.cognome + ' ' + item.nome,
        goodVotesPercentage: (item.percentagesAvg || 0),
        difference: (Math.round(item.percentagesAvg - schoolAvg) || 0)
      }
    })
  })

export const generalData = createSelector(
  schoolVotes,
  questions,
  (schoolVotes, questions) => {
    const data = schoolVotes.slice(12)
    const generalQuestions = questions.slice(12)

    return data.map((item, i) => ({
      question: generalQuestions[i],
      goodVotesPercentage: (data[i].goodVotesPercentage || 0)
    })
    )

  })

