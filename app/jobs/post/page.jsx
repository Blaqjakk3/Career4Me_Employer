'use client';
import { useEffect, useState } from "react";
import { useActionState } from "react";
import JobsLayout from "../_layout";
import createJob from "../../actions/createJob";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PlusIcon, ArrowLeft, Briefcase, Sparkles, Target, Zap, Calendar } from 'lucide-react';

const jobTypes = ["Full Time", "Part Time", "Contract", "Internship"];
const industries = ["Technology", "Business", "Healthcare", "Finance", "Creative Arts",
    "Engineering", "Science", "Education", "Environment"];
const workEnvironments = ["In Person", "Remote"];
const seniorityLevels = ["Entry-Level", "Mid-Level", "Senior-Level"];
const careerPaths = ["Accountant", "Actuary", "Aerospace Engineer", "AI Engineer", "AI Product Manager", "Anesthesiologist", "Animator", "Art Director", "Astronomer", "Auditor", "Automotive Engineer", "Backend Developer", "Biologist", "Biomedical Engineer", "Biotechnologist", "Blockchain Developer", "Business Analyst", "Chemical Engineer", "Chemist", "Chiropractor", "Civil Engineer", "Climate Scientist",
    "Cloud Architect", "College Professor", "Copywriter", "Creative Director", "Credit Analyst", "Curriculum Developer", "Cybersecurity Analyst", "Data Analyst", "Data Engineer", "Data Scientist", "Database Administrator", "Dentist", "DevOps Engineer", "Dietitian", "Education Policy Analyst", "Educational Consultant", "Electrical Engineer", "Entrepreneur", "Environmental Engineer", "Environmental Scientist", "ESL Teacher", "Ethical Hacker", "Event Planner", "Fashion Designer", "Film Director", "Financial Analyst", "Financial Planner", "Forensic Scientist", "Frontend Developer", "Full-Stack Developer", "Game Developer", "Geologist", "Geotechnical Engineer", "Graphic Designer", "Healthcare Administrator", "Human Resources Manager", "Industrial Engineer", "Instructional Designer", "Insurance Underwriter", "Interior Designer", "Investment Banker", "IT Manager", "Librarian", "Logistics Manager", "Machine Learning Engineer", "Management Consultant", "Marine Engineer", "Materials Engineer", "Mechanical Engineer", "Medical Laboratory Scientist", "Medical Researcher", "Meteorologist", "Microbiologist", "Mobile App Developer", "Music Producer", "Network Administrator", "Nuclear Engineer", "Nurse Practitioner", "Occupational Therapist", "Operations Manager", "Optometrist", "Pediatrician", "Petroleum Engineer", "Pharmacist", "Photographer", "Physical Therapist", "Physicist", "Product Manager", "Project Manager", "Prompt Engineer", "Psychologist", "Public Relations Manager", "QA Engineer", "Radiologist", "Risk Manager",
    "Robotics Engineer", "Sales Manager", "School Counselor", "School Principal", "Software Engineer", "Special Education Teacher", "Structural Engineer", "Supply Chain Manager", "Surgeon", "Sustainability Specialist", "Systems Analyst", "Systems Engineer", "Tax Consultant", "Teacher", "Technical Writer", "UX Designer", "Video Editor", "VR/AR Developer", "Wealth Manager"];

const PostJobs = () => {
    const [state, formAction] = useActionState(createJob, {});
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        applylink: "",
        jobtype: jobTypes[0],
        workenvironment: workEnvironments[0],
        seniorityLevel: seniorityLevels[0],
        relatedpaths: [],
        skills: [],
        requiredDegrees: [],
        suggestedCertifications: [],
        industry: industries[0],
        responsibilities: [],
        qualities: [],
        expiryDate: "",
    });

    const [selectedPath, setSelectedPath] = useState('');
    const [responsibilitiesInput, setResponsibilitiesInput] = useState('');
    const [qualitiesInput, setQualitiesInput] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [degreesInput, setDegreesInput] = useState('');
    const [certificationsInput, setCertificationsInput] = useState('');

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (state.error) toast.error(state.error);
        if (state.success) {
            toast.success('Job created successfully!');
            router.push('/jobs');
        }
    }, [state, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddPath = () => {
        if (selectedPath && !formData.relatedpaths.includes(selectedPath)) {
            setFormData({
                ...formData,
                relatedpaths: [...formData.relatedpaths, selectedPath]
            });
            setSelectedPath('');
        }
    };

    const handleRemovePath = (pathToRemove) => {
        setFormData({
            ...formData,
            relatedpaths: formData.relatedpaths.filter(path => path !== pathToRemove)
        });
    };

    const handleAddItem = (name, value, setInput) => {
        if (value && !formData[name].includes(value)) {
            setFormData({
                ...formData,
                [name]: [...formData[name], value]
            });
            setInput('');
        }
    };

    const handleRemoveItem = (name, index) => {
        const updatedList = [...formData[name]];
        updatedList.splice(index, 1);
        setFormData({ ...formData, [name]: updatedList });
    };

    return (
        <JobsLayout>
            <div className="min-h-screen bg-white">
                {/* Background decorations */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="mb-12 space-y-6">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back to Jobs</span>
                        </button>

                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                            <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-blue-800">Create New Opportunity</span>
                        </div>

                        {/* Title */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                Post Your Next
                                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Great Hire
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                                Create a compelling job posting that attracts top talent and showcases your company culture
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="flex flex-wrap gap-4 mt-8">
                            <div className="flex items-center px-6 py-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                    <Target className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Targeted Reach</div>
                                    <div className="text-xs text-gray-500">Quality candidates</div>
                                </div>
                            </div>

                            <div className="flex items-center px-6 py-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                    <Zap className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Quick Setup</div>
                                    <div className="text-xs text-gray-500">Go live instantly</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Job Details</h2>
                                    <p className="text-blue-100">Fill in the information below to create your job posting</p>
                                </div>
                            </div>
                        </div>

                        <form action={formAction} className="p-8 space-y-8">
                            {/* Basic Information Section */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-sm font-bold text-blue-600">1</span>
                                    </div>
                                    Basic Information
                                </h3>

                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="e.g. Senior Software Engineer"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Job Description *</label>
                                        <textarea
                                            name="description"
                                            placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32 resize-none"
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Location *</label>
                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="e.g. San Francisco, CA"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Application Link *</label>
                                            <input
                                                type="url"
                                                name="applylink"
                                                placeholder="https://company.com/apply"
                                                value={formData.applylink}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Expiry Date Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                        Job Expiry Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        min={today}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-al"
                                    />
                                    <p className="text-sm text-gray-500">
                                        If set, this job will automatically be removed after the specified date.
                                    </p>
                                </div>
                            </div>

                            {/* Job Specifications Section */}
                            <div className="space-y-6 pt-8 border-t border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-sm font-bold text-indigo-600">2</span>
                                    </div>
                                    Job Specifications
                                </h3>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Job Type</label>
                                        <select
                                            name="jobtype"
                                            value={formData.jobtype}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        >
                                            {jobTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Work Environment</label>
                                        <select
                                            name="workenvironment"
                                            value={formData.workenvironment}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        >
                                            {workEnvironments.map(env => (
                                                <option key={env} value={env}>{env}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Seniority Level</label>
                                        <select
                                            name="seniorityLevel"
                                            value={formData.seniorityLevel}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        >
                                            {seniorityLevels.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Industry</label>
                                        <select
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required
                                        >
                                            {industries.map(industry => (
                                                <option key={industry} value={industry}>{industry}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Career Paths Section */}
                            <div className="space-y-6 pt-8 border-t border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-sm font-bold text-purple-600">3</span>
                                    </div>
                                    Career Paths
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <select
                                            value={selectedPath}
                                            onChange={(e) => setSelectedPath(e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">Select a career path</option>
                                            {careerPaths
                                                .filter(path => !formData.relatedpaths.includes(path))
                                                .map(path => (
                                                    <option key={path} value={path}>{path}</option>
                                                ))
                                            }
                                        </select>
                                        <button
                                            type="button"
                                            onClick={handleAddPath}
                                            disabled={!selectedPath}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                                        >
                                            <PlusIcon size={20} />
                                        </button>
                                    </div>

                                    {formData.relatedpaths.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.relatedpaths.map((path, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium"
                                                >
                                                    {path}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePath(path)}
                                                        className="ml-2 text-red-200 hover:text-red-100 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {formData.relatedpaths.map((path, index) => (
                                        <input key={`hidden-path-${index}`} type="hidden" name="relatedpaths" value={path} />
                                    ))}
                                </div>
                            </div>

                            {/* Additional Details Section */}
                            <div className="space-y-6 pt-8 border-t border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-sm font-bold text-green-600">4</span>
                                    </div>
                                    Additional Details
                                </h3>

                                <div className="grid lg:grid-cols-2 gap-8">
                                    {/* Responsibilities - Larger Text Area */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                                        <div className="flex gap-3">
                                            <textarea
                                                placeholder="e.g. Lead development of new features"
                                                value={responsibilitiesInput}
                                                onChange={(e) => setResponsibilitiesInput(e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 resize-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleAddItem('responsibilities', responsibilitiesInput, setResponsibilitiesInput)}
                                                disabled={!responsibilitiesInput}
                                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 self-start"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.responsibilities.map((item, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200"
                                                >
                                                    {item}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem('responsibilities', index)}
                                                        className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>

                                        {formData.responsibilities.map((item, index) => (
                                            <input key={`hidden-responsibilities-${index}`} type="hidden" name="responsibilities" value={item} />
                                        ))}
                                    </div>

                                    <div className="lg:col-span-2 space-y-4">
                                        <label className="block text-sm font-medium text-gray-700">Preferred Qualities</label>
                                        <div className="flex gap-3">
                                            <textarea
                                                placeholder="e.g. Strong problem-solving skills"
                                                value={qualitiesInput}
                                                onChange={(e) => setQualitiesInput(e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 resize-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleAddItem('qualities', qualitiesInput, setQualitiesInput)}
                                                disabled={!qualitiesInput}
                                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 self-start"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.qualities.map((item, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200"
                                                >
                                                    {item}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem('qualities', index)}
                                                        className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>

                                        {formData.responsibilities.map((item, index) => (
                                            <input key={`hidden-qualities-${index}`} type="hidden" name="qualities" value={item} />
                                        ))}
                                    </div>

                                    {/* Other Fields */}
                                    {[
                                        {
                                            field: 'skills',
                                            input: skillInput,
                                            setInput: setSkillInput,
                                            placeholder: 'e.g. JavaScript, React, Node.js',
                                            label: 'Skills'
                                        },
                                        {
                                            field: 'requiredDegrees',
                                            input: degreesInput,
                                            setInput: setDegreesInput,
                                            placeholder: 'e.g. Bachelor\'s in Computer Science',
                                            label: 'Required Degrees'
                                        },
                                        {
                                            field: 'suggestedCertifications',
                                            input: certificationsInput,
                                            setInput: setCertificationsInput,
                                            placeholder: 'e.g. AWS Certified Developer',
                                            label: 'Suggested Certifications'
                                        },
                                    ].map(({ field, input, setInput, placeholder, label }) => (
                                        <div key={field} className="space-y-4">
                                            <label className="block text-sm font-medium text-gray-700">{label}</label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    placeholder={placeholder}
                                                    value={input}
                                                    onChange={(e) => setInput(e.target.value)}
                                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddItem(field, input, setInput)}
                                                    disabled={!input}
                                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData[field].map((item, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200"
                                                    >
                                                        {item}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveItem(field, index)}
                                                            className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>

                                            {formData[field].map((item, index) => (
                                                <input key={`hidden-${field}-${index}`} type="hidden" name={field} value={item} />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-8 border-t border-gray-200">
                                <button
                                    type="submit"
                                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
                                >
                                    🚀 Publish Job & Start Hiring
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </JobsLayout>
    );
};

export default PostJobs;