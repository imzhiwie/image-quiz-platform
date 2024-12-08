'use client';
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import Image from 'next/image';

// Admin Test Creation Component
export const TestCreationForm = () => {
    const [questionImage, setQuestionImage] = useState<any>(null);
    const [numberOfAnswers, setNumberOfAnswers] = useState(1);
    const [correctAnswers, setCorrectAnswers] = useState<any>([]);

    const handleImageUpload = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader: any = new FileReader();
            reader.onloadend = () => {
                setQuestionImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNumberOfAnswersChange = (e: any) => {
        const num = parseInt(e.target.value);
        setNumberOfAnswers(num);
        // Reset correct answers when number changes
        setCorrectAnswers(new Array(num).fill(''));
        console.log(correctAnswers)
    };

    const handleCorrectAnswerChange = (index: any, value: any) => {
        const newAnswers = [...correctAnswers];
        newAnswers[index] = {answer: value.toUpperCase(), type: value  ? 'auto': 'manual'};
        setCorrectAnswers(newAnswers);
        console.log(correctAnswers)
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Validation logic
        const isValid = correctAnswers.every((answer: any) =>
            answer.length === 1 && /^[A-Z0-9]$/.test(answer)
        );

        if (!questionImage) {
            alert('Please upload a question image');
            return;
        }

        if (!isValid) {
            alert('All answers must be a single character (A-Z or 0-9)');
            return;
        }

        // TODO: Send data to backend
        console.log({
            questionImage,
            numberOfAnswers,
            correctAnswers
        });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create New Test</CardTitle>
            </CardHeader>
            <CardContent>
                {JSON.stringify(correctAnswers, null, 2)}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div>
                        <Label>Question Image</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mt-2"
                        />
                        {questionImage && (
                            <div className="mt-4 relative w-full h-64">
                                <Image
                                    src={questionImage}
                                    alt="Question"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </div>

                    {/* Number of Answers */}
                    <div>
                        <Label>Number of Answers</Label>
                        <Input
                            type="number"
                            min="1"
                            max="10"
                            value={numberOfAnswers}
                            onChange={handleNumberOfAnswersChange}
                            className="mt-2"
                        />
                    </div>

                    {/* Correct Answers Input */}
                    {numberOfAnswers > 0 && (
                        <>
                            {[...Array(numberOfAnswers)].map((_, index) => (
                                <div key={index}>
                                    <Label>Correct Answer {index + 1}</Label>
                                    <Input
                                        type="text"
                                        maxLength={1}
                                        value={correctAnswers[index]['answer'] || ''}
                                        onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                                        className="mt-2"
                                        placeholder="Enter single character"
                                    />
                                </div>
                            ))}
                        </>
                    )}


                    <Button type="submit" className="w-full">
                        Create Test
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

// Student Test Taking Component

interface ComponentProps {
    testData: any
}
export const TestTakingForm = ({ testData }: ComponentProps) => {
    const [studentAnswers, setStudentAnswers] = useState(
        new Array(testData.numberOfAnswers).fill('')
    );

    const handleAnswerChange = (index: any, value: any) => {
        const newAnswers = [...studentAnswers];
        newAnswers[index] = value.toUpperCase();
        setStudentAnswers(newAnswers);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Validation logic
        const isValid = studentAnswers.every(answer =>
            answer.length === 1 && /^[A-Z0-9]$/.test(answer)
        );

        if (!isValid) {
            alert('All answers must be a single character (A-Z or 0-9)');
            return;
        }

        // TODO: Send answers to backend for grading
        console.log(studentAnswers);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Take Test</CardTitle>
            </CardHeader>
            <CardContent>
                {testData.questionImage && (
                    <div className="mb-4 relative w-full h-64">
                        <Image
                            src={testData.questionImage}
                            alt="Test Question"
                            fill
                            className="object-contain"
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[...Array(testData.numberOfAnswers)].map((_, index) => (
                        <div key={index}>
                            <Label>Answer {index + 1}</Label>
                            <Input
                                type="text"
                                maxLength={1}
                                value={studentAnswers[index] || ''}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                className="mt-2"
                                placeholder="Enter single character"
                            />
                        </div>
                    ))}

                    <Button type="submit" className="w-full">
                        Submit Test
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default TestCreationForm;