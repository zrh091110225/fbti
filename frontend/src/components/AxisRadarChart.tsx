import { Axis } from '../config/quizTypes'
import { AxisBreakdown } from '../utils/calculate'

interface AxisRadarChartProps {
  axisBreakdown: AxisBreakdown[]
}

const AXIS_ORDER: Axis[] = ['I', 'S', 'T', 'R']
const CHART_CENTER = 100
const CHART_RADIUS = 72
const GRID_LEVELS = [0.25, 0.5, 0.75, 1]

function getAxisPoint(axis: Axis, radiusFactor: number) {
  const distance = CHART_RADIUS * radiusFactor

  switch (axis) {
    case 'I':
      return { x: CHART_CENTER, y: CHART_CENTER - distance }
    case 'S':
      return { x: CHART_CENTER + distance, y: CHART_CENTER }
    case 'T':
      return { x: CHART_CENTER, y: CHART_CENTER + distance }
    case 'R':
      return { x: CHART_CENTER - distance, y: CHART_CENTER }
  }
}

function getResolvedScore(axis: AxisBreakdown) {
  return axis.resolvedTo === axis.leftCode ? axis.leftScore : axis.rightScore
}

function buildSmoothClosedPath(points: Array<{ x: number; y: number }>, tension = 1) {
  if (points.length < 2) {
    return ''
  }

  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} Z`
  }

  const size = points.length
  let path = `M ${points[0].x} ${points[0].y}`

  for (let index = 0; index < size; index += 1) {
    const previous = points[(index - 1 + size) % size]
    const current = points[index]
    const next = points[(index + 1) % size]
    const nextNext = points[(index + 2) % size]

    const controlPoint1X = current.x + ((next.x - previous.x) / 6) * tension
    const controlPoint1Y = current.y + ((next.y - previous.y) / 6) * tension
    const controlPoint2X = next.x - ((nextNext.x - current.x) / 6) * tension
    const controlPoint2Y = next.y - ((nextNext.y - current.y) / 6) * tension

    path += ` C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${next.x} ${next.y}`
  }

  return `${path} Z`
}

function AxisRadarChart({ axisBreakdown }: AxisRadarChartProps) {
  const orderedBreakdown = AXIS_ORDER
    .map((axisCode) => axisBreakdown.find((item) => item.axis === axisCode))
    .filter((item): item is AxisBreakdown => Boolean(item))

  const chartItems = orderedBreakdown.map((axis) => ({
    ...axis,
    chartValue: getResolvedScore(axis) / 10,
    resolvedScore: getResolvedScore(axis),
    point: getAxisPoint(axis.axis, getResolvedScore(axis) / 10)
  }))

  const smoothPolygonPath = buildSmoothClosedPath(chartItems.map((axis) => axis.point), 0.9)

  const ariaLabel = chartItems
    .map((axis) => `${axis.title}${axis.resolvedLabel}，类型码${axis.resolvedTo}，得分${axis.resolvedScore}`)
    .join('；')

  return (
    <div className="axis-chart" role="img" aria-label={`四轴多边形图：${ariaLabel}`}>
      <div className="axis-chart-stage">
        <div className="axis-chart-plot">
          <svg
            className="axis-chart-svg"
            viewBox="0 0 200 200"
            aria-hidden="true"
            focusable="false"
          >
            {GRID_LEVELS.map((level) => (
              <path
                key={level}
                className="axis-chart-grid"
                d={buildSmoothClosedPath(AXIS_ORDER.map((axis) => getAxisPoint(axis, level)), 0.9)}
              />
            ))}

            {AXIS_ORDER.map((axis) => {
              const point = getAxisPoint(axis, 1)
              return (
                <line
                  key={axis}
                  className="axis-chart-spoke"
                  x1={CHART_CENTER}
                  y1={CHART_CENTER}
                  x2={point.x}
                  y2={point.y}
                />
              )
            })}

            <path className="axis-chart-area" d={smoothPolygonPath} />
            <path className="axis-chart-outline" d={smoothPolygonPath} />

            {chartItems.map((axis) => (
              <circle
                key={axis.axis}
                className="axis-chart-point"
                cx={axis.point.x}
                cy={axis.point.y}
                r="4.5"
              />
            ))}

            <circle className="axis-chart-center" cx={CHART_CENTER} cy={CHART_CENTER} r="3" />
          </svg>

          {chartItems.map((axis) => (
            <div
              key={axis.axis}
              className={`axis-chart-label axis-chart-label--${axis.axis.toLowerCase()}`}
            >
              <strong className="axis-chart-label-type">{axis.resolvedTo}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="axis-chart-detail-table-wrap" aria-hidden="true">
        <table className="axis-chart-detail-table">
          <thead>
            <tr>
              <th>维度</th>
              <th>类型</th>
              <th>类型码</th>
              <th>得分</th>
            </tr>
          </thead>
          <tbody>
            {chartItems.map((axis) => (
              <tr key={axis.axis}>
                <td>{axis.title}</td>
                <td>{axis.resolvedLabel}</td>
                <td>{axis.resolvedTo}</td>
                <td>{axis.resolvedScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AxisRadarChart
