import cat_pfp from "./cat_pfp.png";
import dog_pfp from "./dog_pfp.png";
import robot_pfp from "./robot_pfp.png";
import galaxybrain_pfp from "./galaxybrain.png";
import tinybrain_pfp from "./tinybrain.webp";
import noobbrain from "./noobbrain.jpg";
import einstein_pfp from "./einstein.webp";
import engineer_pfp from "./engineer.jpg";
import doctor_pfp from "./doctor.avif";
import knight_pfp from "./knight.webp";
import dragon_pfp from "./dragon.jpg";
import mtfuji from "./mtFuji.jpg";
import test from "./test.gif";

export const avatarMap = {
    noobbrain: noobbrain,
    mtfuji: mtfuji,
    test: test,
    cat_pfp: cat_pfp,
    dog_pfp: dog_pfp,
    robot_pfp: robot_pfp,
    galaxybrain_pfp: galaxybrain_pfp,
    tinybrain_pfp: tinybrain_pfp,
    einstein_pfp: einstein_pfp,
    engineer_pfp: engineer_pfp,
    doctor_pfp: doctor_pfp,
    knight_pfp: knight_pfp,
    dragon_pfp: dragon_pfp
}

export const items = [
    { id: "tinybrain_pfp", name: "Tiny Brain Avatar", desc: "Size doesn’t matter (but answers might be wrong).", cost: 50, img: tinybrain_pfp },
    { id: "cat_pfp", name: "Cat Avatar", desc: "Meow!", cost: 100, img: cat_pfp },
    { id: "dog_pfp", name: "Dog Avatar", desc: "Woof!", cost: 100, img: dog_pfp },
    { id: "robot_pfp", name: "Robot Avatar", desc: "010011000100111101001100", cost: 200, img: robot_pfp },
    { id: "einstein_pfp", name: "Professor Avatar", desc: "E=MC^2!", cost: 300, img: einstein_pfp },
    { id: "engineer_pfp", name: "Engineer Avatar", desc: "Nothing makes an engineer more productive than the last minute.", cost: 300, img: engineer_pfp },
    { id: "doctor_pfp", name: "Doctor Avatar", desc: "The apple ate my face", cost: 300, img: doctor_pfp },
    { id: "knight_pfp", name: "Knight Avatar", desc: "Had a rough kNIGHT?", cost: 500, img: knight_pfp },
    { id: "dragon_pfp", name: "Dragon Avatar", desc: "I am a chicken", cost: 700, img: dragon_pfp },
    { id: "galaxybrain_pfp", name: "Galaxy Brain Avatar", desc: "Big brain energy.", cost: 1000, img: galaxybrain_pfp, style: "animate-pulse"},
];