import Accordion from 'react-bootstrap/Accordion';
import {useAccordionButton} from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import {TickCircle} from "../../assets/icon";


const module1 = [
    {
        title: "Yangi darajabilam tanishuv",
        duration: "3 min",
        done: true,
        active: false
    },
    {
        title: "Grammatikani kaytarish metodi",
        duration: "1:50 min",
        done: true,
        active: false
    },
    {
        title: "Present perfect vs Passive Voice",
        duration: "5:43 min",
        done: true,
        active: false
    },
    {
        title: "Present perfect vs Passive Voice",
        duration: "5:43 min",
        done: false,
        active: true // 5-chi active
    },
    {
        title: "Present perfect vs Passive Voice",
        duration: "5:43 min",
        done: false,
        active: false
    },
    {
        title: "Present perfect vs Passive Voice",
        duration: "5:43 min",
        done: false,
        active: false
    },
    {
        title: "Present perfect vs Passive Voice",
        duration: "5:43 min",
        done: false,
        active: false
    },
    {
        title: "Test",
        duration: "30 min",
        done: false,
        active: false
    },
    {
        title: "Present perfect vs Passive Voice",
        duration: "5:43 min",
        done: false,
        active: false
    },
    {
        title: "Present perfect vs Passive Voice",
        duration: "5:43 min",
        done: false,
        active: false
    },
];


const lessons = [
    "Ingliz tili darajangizni 21 kunda: A2 dan B2 darajaga o’ting",
    "Ingliz tili darajangizni 21 kunda: B2 dan C1 darajaga o’ting",
    "Ingliz tili darajangizni 21 kunda: C1 dan C2 darajaga o’ting",
]

interface CustomToggleProps {
    children: React.ReactNode;
    eventKey: string;
}

function CustomToggle({children, eventKey}: CustomToggleProps) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('totally custom!'),
    );

    return (
        <button
            type="button"
            onClick={decoratedOnClick}
        >
            {children}
        </button>
    );
}

function LessonBarAccordion() {
    return (
        <Accordion defaultActiveKey="0">
            {
                lessons.map((lesson, index) =>
                    <Card key={index}>
                        <Card.Header>
                            <CustomToggle eventKey={index.toString()}>
                                <p className='text-secondary text-start m-0'>Modul {index + 1}:</p>
                                <h5 className='m-0'>{lesson}</h5>
                            </CustomToggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={index.toString()}>
                            <Card.Body>
                                {
                                    module1.map((item, idx) =>
                                        <div key={idx}
                                             className={`lesson-bar-item ${item.done ? 'done' : item.active ? "active" : 'false'}`}>
                                            <div>
                                                <TickCircle/>
                                            </div>
                                            <div className='d-sm-flex d-md-block justify-content-between align-items-center gap-2 w-100'>
                                                <p>{item.title}</p>
                                                <p>{item.duration}</p>
                                            </div>
                                        </div>
                                    )
                                }

                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                )
            }
        </Accordion>
    );
}

export default LessonBarAccordion;