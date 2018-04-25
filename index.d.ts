interface IOptions {
    shouldLog?: boolean;
    port?: number;
    components?: string[];
}

interface IMeasureDetail {
    averageTimeSpentMs: string;
    numberOfTimes: number;
    totalTimeSpentMs: number;
}

interface IMeasure {
    componentName: string; // Name of the component
    totalTimeSpent: number; // Total time taken by the component combining all the phases
    percentTimeSpent: string; // Percent time
    numberOfInstances: number; // Number of instances of the component
    mount: IMeasureDetail; // Mount time
    render: IMeasureDetail; // Render time
    update: IMeasureDetail; // Update time
    unmount: IMeasureDetail; // Unmount time

    // Time taken in lifecycle hooks
    componentWillMount: IMeasureDetail;
    componentDidMount: IMeasureDetail;
    componentWillReceiveProps: IMeasureDetail;
    shouldComponentUpdate: IMeasureDetail;
    componentWillUpdate: IMeasureDetail;
    componentDidUpdate: IMeasureDetail;
    componentWillUnmount: IMeasureDetail;
}

declare module 'react-perf-devtool' {
    function registerObserver(
        options: IOptions,
        callback?: (measures: Array<IMeasure>) => void
    ): void
}