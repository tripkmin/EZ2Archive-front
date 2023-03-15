// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/line
import { ResponsiveLine } from '@nivo/line'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const MyResponsiveLine = ({ data /* see data tab */ }) => (
    <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 40, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={null}
            // {
            // orient: 'bottom',
            // tickSize: 5,
            // tickPadding: 5,
            // tickRotation: 0,
            // legend: '기록',
            // legendOffset: 35,
            // legendPosition: 'middle'
            // }
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'percent',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        enableGridX={false}
        enableGridY={false}
        colors={{ scheme: 'spectral' }}
        lineWidth={3}
        pointSize={10}
        pointColor={{ from: 'color', modifiers: [] }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'color', modifiers: [] }}
        pointLabelYOffset={-12}
        areaBlendMode="screen"
        crosshairType="cross"
        useMesh={true}
        legends={[
            // {
            //     anchor: 'bottom-right',
            //     direction: 'row',
            //     justify: false,
            //     translateX: 20,
            //     translateY: -12,
            //     itemsSpacing: 0,
            //     itemDirection: 'left-to-right',
            //     itemWidth: 80,
            //     itemHeight: 25,
            //     itemOpacity: 0.75,
            //     symbolSize: 19,
            //     symbolShape: 'circle',
            //     symbolBorderColor: 'rgba(0, 0, 0, .5)',
            //     effects: [
            //         {
            //             on: 'hover',
            //             style: {
            //                 itemBackground: 'rgba(0, 0, 0, .03)',
            //                 itemOpacity: 1
            //             }
            //         }
            //     ]
            // }
        ]}
        motionConfig="default"
    />
)
