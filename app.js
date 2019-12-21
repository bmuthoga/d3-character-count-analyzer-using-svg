let width = 800
let height = 400
let barPadding = 10
let svg = d3.select('svg')
              .attr('width', width)
              .attr('height', height)

let finalString = ''
let counter = 1

d3.select('form')
  .on('submit', handleSubmit)

d3.select('#reset')
  .on('click', handleReset)

function getData(input) {
  // let result= []
  let stringArr = input.split('').sort()

  return stringArr.reduce((acc, currentChar) => {
    let lastObj = acc[acc.length - 1]

    if (lastObj && lastObj.character === currentChar) {
      lastObj.count++
    } else {
      acc.push({ character: currentChar, count: 1 })
    }

    return acc
  }, [])

  // for (let i = 0; i < stringArr.length; i++) {
  //   if (result.length > 0 && result[result.length - 1].character === stringArr[i]) {
  //     result[result.length - 1].count += 1
  //   } else {
  //     result.push({ character: stringArr[i], count: 1 })
  //   }
  // }

  // return result
}

function printPhrase(input) {
  d3.select('#phrase')
    .text(`Analysis of: ${input}`)
}

function printCount(letters) {
  let count = letters
                .enter()
                .nodes()
                .length

  d3.select('#count')
    .text(`(New characters: ${count})`)
}

function handleSubmit() {
  d3.event.preventDefault()
  let input = d3.select('input').property('value').toLowerCase()

  if (isInputEmpty(input)) {
    return
  }
  
  if (counter === 3) {
    counter = 1
    finalString = ''

    d3.selectAll('.letter')
    .remove()
  }

  finalString = finalString.concat(input)
  let data = getData(finalString)
  let barWidth = width / data.length - barPadding
  printPhrase(input)

  let letters = svg
                  .selectAll('.letter')
                  .data(data, d => d.character)

  letters
      .classed('new', false)
    .exit()
    .remove()

  printCount(letters)
  displayGraph(letters, barWidth)
  clearInput()
  counter++
}

function displayGraph(letters, barWidth) {
  let letterEnter = letters
                      .enter()
                      .append('g')
                        .classed('letter', true)
                        .classed('new', true)

  letterEnter.append('rect')
  letterEnter.append('text')
  
  letterEnter
    .merge(letters)
    .select('rect')
      .style('width', barWidth)
      .style('height', d => d.count * 20)
      .attr('x', (d, idx) => (barWidth + barPadding) * idx)
      .attr('y', d => height - d.count * 20)

  letterEnter
    .merge(letters)
    .select('text')
      .attr('x', (d, idx) => (barWidth + barPadding) * idx + barWidth / 2)
      .attr('y', d => height - d.count * 20 - 10)
      .attr('text-anchor', 'middle')
      .text(d => d.character)
}

function clearInput() {
  d3.select('input')
    .property('value', '')
}

function handleReset() {
  d3.selectAll('.letter')
    .remove()

  d3.select('#count')
    .text('')

  d3.select('#phrase')
    .text('')
}

function isInputEmpty(input) {
  return input.length === 0 || input.match(/^(\s+)$/g)
}
