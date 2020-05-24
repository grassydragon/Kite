import { Lesson } from "./lesson.js"
import { Objective } from "./objective.js"

export let LESSONS = [
    new Lesson(
        "Takeoff",
        [
            new Objective(
                "Wait while the kite flies up",
                -20, 20,
                60, 80,
                null, null,
                null
            )
        ]
    ),
    new Lesson(
        "Pull Turns",
        [
            new Objective(
                "Wait while the kite flies up",
                -20, 20,
                60, 80,
                null, null,
                null
            ),
            new Objective(
                "Fly slightly to the left by moving the left stick down",
                -60, -20,
                60, 80,
                null, null,
                null
            ),
            new Objective(
                "Fly back to the center by moving the right stick down",
                -20, 20,
                60, 80,
                null, null,
                null
            ),
            new Objective(
                "Fly slightly to the right by moving the right stick down",
                20, 60,
                60, 80,
                null, null,
                null
            ),
            new Objective(
                "Fly back to the center by moving the left stick down",
                -20, 20,
                60, 80,
                null, null,
                null
            ),
            new Objective(
                "Fly further to the left",
                -70, -40,
                50, 70,
                null, null,
                null
            ),
            new Objective(
                "Fly further to the right",
                40, 70,
                50, 70,
                null, null,
                null
            ),
            new Objective(
                "Fly back to the center",
                -20, 20,
                60, 80,
                null, null,
                null
            )
        ]
    ),
    new Lesson(
        "Push Turns",
        [
            new Objective(
                "Wait while the kite flies up",
                -20, 20,
                60, 80,
                null, null,
                null
            ),
            new Objective(
                "Fly slightly to the left by moving the right stick up",
                -60, -20,
                60, 80,
                null, null,
                null
            ),
            new Objective(
                "Fly back to the center by moving the left stick up",
                -20, 20,
                60, 80,
                null, null,
                null
            ),
            new Objective(
                "Fly slightly to the right by moving the left stick up",
                20, 60,
                60, 80,
                null, null,
                null
            ),
            new Objective(
                "Fly back to the center by moving the right stick up",
                -20, 20,
                60, 80,
                null, null,
                null
            ),
            new Objective(
                "Fly further to the left",
                -70, -40,
                50, 70,
                null, null,
                null
            ),
            new Objective(
                "Fly further to the right",
                40, 70,
                50, 70,
                null, null,
                null
            ),
            new Objective(
                "Fly back to the center",
                -20, 20,
                60, 80,
                null, null,
                null
            )
        ]
    ),
    new Lesson(
        "Combination Turns",
        [
            new Objective(
                "Wait while the kite flies up",
                -20, 20,
                60, 80,
                null, null,
                null
            ),
            new Objective(
                "Fly to the left by moving the left stick down and the right stick up",
                -70, -40,
                50, 70,
                null, null,
                null
            ),
            new Objective(
                "Fly to the right by moving the left stick up and the right stick down",
                40, 70,
                50, 70,
                null, null,
                null
            ),
            new Objective(
                "Fly to the left again",
                -70, -40,
                50, 70,
                null, null,
                null
            ),
            new Objective(
                "Fly to the right again",
                40, 70,
                50, 70,
                null, null,
                null
            ),
            new Objective(
                "Fly back to the center",
                -20, 20,
                60, 80,
                null, null,
                null
            )
        ]
    ),
    new Lesson(
        "Wind Window",
        [
            new Objective(
                "Fly to the left edge of the wind window",
                -80, -60,
                -4, 40,
                null, null,
                null
            ),
            new Objective(
                "Fly to the right edge of the wind window",
                60, 80,
                -4, 40,
                null, null,
                null
            ),
            new Objective(
                "Fly to the center of the wind window",
                -15, 15,
                -4, 30,
                null, null,
                null
            ),
            new Objective(
                "Fly to the upper edge of the wind window",
                -40, 40,
                60, 80,
                null, null,
                null
            )
        ]
    ),
    new Lesson(
        "Left Landing",
        [
            new Objective(
                "Fly to the left edge of the wind window",
                -80, -60,
                -4, 40,
                null, null,
                null
            ),
            new Objective(
                "Keep the kite flying slowly to the ground",
                null, null,
                null, null,
                -180, 0,
                null,
                true
            )
        ]
    ),
    new Lesson(
        "Right Landing",
        [
            new Objective(
                "Fly to the right edge of the wind window",
                60, 80,
                -4, 40,
                null, null,
                null
            ),
            new Objective(
                "Keep the kite flying slowly to the ground",
                null, null,
                null, null,
                0, 180,
                null,
                true
            )
        ]
    ),
    new Lesson(
        "Twisted Lines",
        [
            new Objective(
                "Make a complete turn counterclockwise to twist the lines",
                null, null,
                null, null,
                -20, 20,
                -1
            ),
            new Objective(
                "Make a complete turn clockwise to untwist the lines",
                null, null,
                null, null,
                -20, 20,
                0
            ),
            new Objective(
                "Make a complete turn clockwise to twist the lines",
                null, null,
                null, null,
                -20, 20,
                1
            ),
            new Objective(
                "Make a complete turn counterclockwise to untwist the lines",
                null, null,
                null, null,
                -20, 20,
                0
            )
        ]
    ),
    new Lesson(
        "Loops",
        [
            new Objective(
                "Make a counterclockwise loop",
                -30, -10,
                20, 40,
                null, null,
                null
            ),
            new Objective(
                "Make a counterclockwise loop",
                -10, 10,
                -4, 20,
                0, 180,
                null
            ),
            new Objective(
                "Make a counterclockwise loop",
                10, 30,
                20, 40,
                -90, 90,
                null
            ),
            new Objective(
                "Make a clockwise loop",
                -10, 10,
                40, 60,
                -180, 0,
                null
            ),
            new Objective(
                "Make a clockwise loop",
                10, 30,
                20, 40,
                null, null,
                null
            ),
            new Objective(
                "Make a clockwise loop",
                -10, 10,
                -4, 20,
                -180, 0,
                null
            ),
            new Objective(
                "Make a clockwise loop",
                -30, -10,
                20, 40,
                -90, 90,
                null
            ),
            new Objective(
                "Make a clockwise loop",
                -10, 10,
                40, 60,
                0, 180,
                null
            ),
        ]
    ),
    new Lesson(
        "Figure Eights",
        [
            new Objective(
                "Make a figure eight",
                -50, -30,
                20, 40,
                null, null,
                null
            ),
            new Objective(
                "Make a figure eight",
                -30, -10,
                -4, 20,
                0, 180,
                null
            ),
            new Objective(
                "Make a figure eight",
                -10, 10,
                20, 40,
                -45, 135,
                null
            ),
            new Objective(
                "Make a figure eight",
                10, 30,
                40, 60,
                0, 180,
                null
            ),
            new Objective(
                "Make a figure eight",
                30, 50,
                20, 40,
                null, null,
                null
            ),
            new Objective(
                "Make a figure eight",
                10, 30,
                -4, 20,
                -180, 0,
                null
            ),
            new Objective(
                "Make a figure eight",
                -10, 10,
                20, 40,
                -135, 45,
                null
            ),
            new Objective(
                "Make a figure eight from",
                -30, -10,
                40, 60,
                -180, 0,
                null
            )
        ]
    ),
    new Lesson(
        "Low Passes",
        [
            new Objective(
                "Make a low pass from left to right",
                -60, -40,
                -4, 20,
                0, 180,
                null
            ),
            new Objective(
                "Make a low pass from left to right",
                -40, -20,
                -4, 20,
                0, 180,
                null
            ),
            new Objective(
                "Fly low from left to right",
                -20, 0,
                -4, 20,
                0, 180,
                null
            ),
            new Objective(
                "Make a low pass from left to right",
                0, 20,
                -4, 20,
                0, 180,
                null
            ),
            new Objective(
                "Make a low pass from left to right",
                20, 40,
                -4, 20,
                0, 180,
                null
            ),
            new Objective(
                "Make a low pass from left to right",
                40, 60,
                -4, 20,
                0, 180,
                null
            ),
            new Objective(
                "Make a low pass from right to left",
                40, 60,
                -4, 20,
                -180, 0,
                null
            ),
            new Objective(
                "Make a low pass from right to left",
                40, 60,
                -4, 20,
                -180, 0,
                null
            ),
            new Objective(
                "Make a low pass from right to left",
                20, 40,
                -4, 20,
                -180, 0,
                null
            ),
            new Objective(
                "Make a low pass from right to left",
                0, 20,
                -4, 20,
                -180, 0,
                null
            ),
            new Objective(
                "Make a low pass from right to left",
                -20, 0,
                -4, 20,
                -180, 0,
                null
            ),
            new Objective(
                "Make a low pass from right to left",
                -40, -20,
                -4, 20,
                -180, 0,
                null
            ),
            new Objective(
                "Make a low pass from right to left",
                -60, -20,
                -4, 20,
                -180, 0,
                null
            )
        ]
    )
];