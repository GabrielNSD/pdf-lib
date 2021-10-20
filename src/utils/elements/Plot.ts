import { Coordinates } from '../../types'
import { plus } from '../maths'

import GraphElement from './GraphElement'
import Point, { PointXY } from './Point'
import { SegmentAB } from './Segment'
export default abstract class Plot extends GraphElement {
  abstract getPoints(): Coordinates[]

  isEqual(element: GraphElement): boolean {
    if (!(element instanceof Plot)) return false
    const points = this.getPoints().map(coord => new PointXY(coord))
    const points2 = element.getPoints().map(coord => new PointXY(coord))
    return (
      points.every((point, i) => point.isEqual(points2[i])) ||
      points.reverse().every((point, i) => point.isEqual(points2[i]))
    )
  }

  orthoProjection(P: Point) {
    const points = this.getPoints()
    const orthos = points
      .slice(0, -1)
      .map((pt, i) => new SegmentAB(new PointXY(pt), new PointXY(points[i + 1])))
      .map(seg => {
        return seg.orthoProjection(P)
      })
    let min = Number.POSITIVE_INFINITY
    let closest: Point = new PointXY(points[0])
    orthos.forEach(ortho => {
      const d = ortho.distance(P)
      if (d < min) {
        min = d
        closest = ortho
      }
    })
    return closest
  }
}

export class PlotFree extends Plot {
  static type = 'PlotFree' as const
  points: Coordinates[]

  constructor(points: Coordinates[] = []) {
    super()
    this.points = points
  }

  getPoints() {
    return [...this.points]
  }

  translate(translationVector: Coordinates) {
    this.points = this.points.map(point => plus(point, translationVector))
  }
}
