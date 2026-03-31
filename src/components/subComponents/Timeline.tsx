'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';

export interface ITimeLineProps {
    requestId: number;
    ticketStatus: string;
    mobile: boolean; // same semantic as your original: true => desktop timeline; false => mobile block
    year: string;
    items: any[]; // expects fields: Created, Action, ActionBy, BusinessGroup, StepTitle
}

interface TimelineValue {
    date: string | Date;
    statusB: string;
    statusE: string;
    Action: string;
    ActionBy: string;
    BusinessGroup: string;
}

export const TimeLine: React.FC<ITimeLineProps> = (props) => {
    const { items = [], ticketStatus, mobile } = props;

    const [timelineIndex, setTimelineIndex] = useState(0);
    const [timelineMobileIndex, setTimelineMobileIndex] = useState(0);
    const [values, setValues] = useState<TimelineValue[]>([]);

    // Build timeline values when items change
    const getTimeLine = useCallback(() => {
        try {
            const mapped: TimelineValue[] = items.map((history: any) => ({
                date: history.Created,
                statusB: `Last action: ${history.Action} by ${history.ActionBy} (${history.BusinessGroup})`,
                statusE: history.StepId,
                Action: history.Action,
                ActionBy: history.ActionBy,
                BusinessGroup: history.BusinessGroup,
            }));

            setValues(mapped);
            setTimelineIndex(0);
            setTimelineMobileIndex(0);
        } catch (e) {
            console.error(e);
        }
    }, [items]);

    useEffect(() => {
        getTimeLine();
    }, [getTimeLine]);

    const isMobileScreen = useCallback((): boolean => {
        return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
    }, []);

    // Navigation guards (memoized for readability/perf)
    const isNextTimelineDisabled = useMemo(() => {
        if (values.length === 0) return true;
        if (values.length % 5 > 0) {
            return timelineIndex > Math.floor(values.length / 5) - 1;
        }
        return timelineIndex === Math.floor(values.length / 5) - 1;
    }, [timelineIndex, values.length]);

    const isPreviousTimelineDisabled = useMemo(() => timelineIndex === 0, [timelineIndex]);

    const isNextTimelineMobileDisabled = useMemo(
        () => timelineMobileIndex === values.length - 1,
        [timelineMobileIndex, values.length]
    );

    const isPreviousTimelineMobileDisabled = useMemo(
        () => timelineMobileIndex === 0,
        [timelineMobileIndex]
    );

    // Handlers
    const nextPageTimeline = useCallback(() => {
        if (!isMobileScreen()) {
            if (!isNextTimelineDisabled) setTimelineIndex((v) => v + 1);
        } else {
            if (!isNextTimelineMobileDisabled) setTimelineMobileIndex((v) => v + 1);
        }
    }, [isMobileScreen, isNextTimelineDisabled, isNextTimelineMobileDisabled]);

    const previousPageTimeline = useCallback(() => {
        if (!isMobileScreen()) {
            if (!isPreviousTimelineDisabled) setTimelineIndex((v) => v - 1);
        } else {
            if (!isPreviousTimelineMobileDisabled) setTimelineMobileIndex((v) => v - 1);
        }
    }, [isMobileScreen, isPreviousTimelineDisabled, isPreviousTimelineMobileDisabled]);

    // Derived layout values
    const progressWidthPct = useMemo(() => {
        if (values.length === 1) return 5;
        return 5 + (values.length - 1) * 20 - timelineIndex * 5 * 20;
    }, [values.length, timelineIndex]);

    const itemLeftPct = useCallback(
        (position: number) =>
            `${position === 0 ? 5 - timelineIndex * 5 * 20 : 5 + position * 20 - timelineIndex * 5 * 20}%`,
        [timelineIndex]
    );

    return (
        <div
            className={
                mobile
                    ? 'hidden lg:flex gap-5 col-span-12'
                    : 'border border-border rounded rounded-t-lg col-span-12 mb-2'
            }
        >
            {mobile ? (
                // Desktop / large screens (as in your original)
                <div className="w-full lg:flex gap-5 col-span-12">
                    <div className="pt-2 mb-4">
                        <button
                            onClick={previousPageTimeline}
                            className={`h-full flex items-center justify-center text-lg px-4 py-2 border rounded-bl rounded-tl font-semibold float-right ${!isPreviousTimelineDisabled
                                    ? 'bg-white border-secondary hover:bg-neutral-100 hover:border-secondaryhover active:bg-neutral-200 active:border-secondaryactive'
                                    : 'bg-neutral-100 text-neutral-300 cursor-default'
                                }`}
                        >
                            {'<'}
                        </button>
                    </div>

                    <div className="w-full pt-2 mb-4 lg:block relative overflow-hidden" style={{ height: "6.2rem" }}>

                        {/* Gray base line */}
                        <div className="absolute w-full h-1 bg-neutral-400" style={{ top: "5.5rem" }} />

                        <div className="h-1 bg-primary absolute" style={{ top: "5.5rem", width: `${values.length == 1 ? 5 : 5 + (values.length - 1) * 20 - (timelineIndex * 5 * 20)}%` }} />
                        {values.map((item, position) => (
                            <div
                                key={`${item.Action}-${item.date}`}
                                className="timeline-item absolute"
                                style={{ width: 300, height: 88, left: `${position == 0 ? 5 - (timelineIndex * 5 * 20) : 5 + position * 20 - (timelineIndex * 5 * 20)}%` }}
                            >
                                <div
                                    className="w-0 top-0 bg-white border border-border absolute"
                                    style={{ left: 5, height: '80%' }}
                                />

                                <div
                                    className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full"
                                    style={{ bottom: "-0.2rem", left: "0.1rem" }}
                                />

                                <div className="absolute left-3 text-xs font-semibold">
                                    {moment(item.date).format("DD/MM/YYYY hh:mm A")} <br />
                                    {item.Action} <br />
                                    {item.ActionBy} ({item.BusinessGroup})
                                    {/* <div>
                                        Step : <b>{item.statusE}</b>
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 mb-4">
                        <button
                            onClick={nextPageTimeline}
                            className={`h-full flex items-center justify-center text-lg px-4 py-2 border rounded-br rounded-tr font-semibold ${!isNextTimelineDisabled
                                    ? 'bg-white border-secondary hover:bg-neutral-100 hover:border-secondaryhover active:bg-neutral-200 active:border-secondaryactive'
                                    : 'bg-neutral-100 text-neutral-300 cursor-default'
                                }`}
                        >
                            {'>'}
                        </button>
                    </div>
                </div>
            ) : (
                // Mobile view (single-card pager)
                <div className="border border-border rounded rounded-t-lg col-span-12 mb-2">
                    <div className="py-2 px-4 text-lg font-semibold border-b border-border">
                        Timeline ({`${timelineMobileIndex + 1}/${values.length || 0}`})

                    </div>
                    <div className="flex">
                        <div>
                            <button
                                onClick={previousPageTimeline}
                                className={`h-full flex items-center justify-center text-lg px-4 py-2 border rounded-bl rounded-tl font-semibold float-right ${!isPreviousTimelineMobileDisabled
                                        ? 'bg-white border-secondary hover:bg-neutral-100 hover:border-secondaryhover active:bg-neutral-200 active:border-secondaryactive'
                                        : 'bg-neutral-100 text-neutral-300 cursor-default'
                                    }`}
                            >
                                {'<'}
                            </button>
                        </div>

                        <div className="grow p-4">
                            {values.map((item, position) => (
                                <div className="timeline-item absolute" style={{ width: 300, height: 88, left: `${position == 0 ? 5 - (timelineIndex * 5 * 20) : 5 + position * 20 - (timelineIndex * 5 * 20)}%` }}>
                                    <div className="w-0 top-0 bg-white border border-border absolute" style={{ left: 5, height: "80%" }} />

                                    <div
                                        className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full"
                                        style={{ bottom: "-0.2rem", left: "0.1rem" }}
                                    />

                                    {
                                        <div className="absolute left-3 text-xs font-semibold"> {moment(item.date).format("DD/MM/YYYY, hh:mm A")} <br />{item.Action} <br />{item.ActionBy}{`(${item.BusinessGroup})`}
                                            {/* <div>Step : <b>{item.statusE}</b></div>  */}</div> 
                                    }
                                </div>
                            ))}
                        </div>
                        <div>
                            <button
                                onClick={nextPageTimeline}
                                className={`h-full flex items-center justify-center text-lg px-4 py-2 border rounded-br rounded-tr font-semibold ${!isNextTimelineMobileDisabled
                                        ? 'bg-white border-secondary hover:bg-neutral-100 hover:border-secondaryhover active:bg-neutral-200 active:border-secondaryactive'
                                        : 'bg-neutral-100 text-neutral-300 cursor-default'
                                    }`}
                            >
                                {'>'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
