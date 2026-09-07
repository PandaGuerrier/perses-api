import Busted from '#internal/events/busted'

export default class BustedListener {
  async handle(event: Busted) {
    console.log('busted listener')
    console.log(event.line)

    // todo : check qui a fait ça, le mettre en bdd (cheat), prévenir via le sse le prof & l'élève
  }
}
