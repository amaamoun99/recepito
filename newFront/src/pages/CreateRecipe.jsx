import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  prepTime: Yup.number().min(0).required("Prep time is required"),
  cookTime: Yup.number().min(0).required("Cook time is required"),
  servings: Yup.number().min(1).required("Servings is required"),

  instructions: Yup.array()
    .of(Yup.string().required("Instruction required"))
    .min(1, "At least one instruction"),
  tags: Yup.string().required("At least one tag is required"),
  image: Yup.mixed().required("Image is required"),
});

const initialValues = {
  title: "",
  description: "",
  prepTime: "",
  cookTime: "",
  servings: "",
  ingredients: [{ name: "", amount: "" }],
  instructions: [""],
  tags: "",
  image: null,
};

const CreateRecipe = () => {
  const { getAuthHeader } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Recipe</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const formData = new FormData();
              formData.append("title", values.title);
              formData.append("description", values.description);
              formData.append("cuisine", "International");
              formData.append("difficulty", "Medium");
              formData.append("servings", values.servings);
              formData.append("cookingTime", parseInt(values.prepTime) + parseInt(values.cookTime));
              formData.append("prepTime", values.prepTime);
              formData.append("diet", "Regular");
              formData.append("image", values.image);
              values.ingredients.forEach((ingredient, index) => {
                formData.append(`ingredients[${index}][name]`, ingredient.name);
                formData.append(`ingredients[${index}][quantity]`, ingredient.amount);
              });
              values.instructions.forEach((instruction, index) => {
                formData.append(`instructions[${index}]`, instruction);
              });
              // Tags as array
              const tagsArray = values.tags.split(",").map(t => t.trim()).filter(Boolean);
              formData.append("tags", JSON.stringify(tagsArray));
              await axios.post(`${API_URL}/posts`, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  ...getAuthHeader(),
                },
              });
              toast({
                title: "Recipe created!",
                description: "Your recipe has been published successfully.",
              });
              navigate("/");
            } catch (error) {
              toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create recipe",
                variant: "destructive",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-8">
              {/* Title */}
              <div>
                <Label htmlFor="title">Recipe Title</Label>
                <Field as={Input} name="title" placeholder="E.g., Homemade Cookies" />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
              </div>
              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Field as={Textarea} name="description" placeholder="Describe your recipe..." />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>
              {/* Prep/Cook/Servings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="prepTime">Prep Time (mins)</Label>
                  <Field as={Input} name="prepTime" type="number" min="0" />
                  <ErrorMessage name="prepTime" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <Label htmlFor="cookTime">Cook Time (mins)</Label>
                  <Field as={Input} name="cookTime" type="number" min="0" />
                  <ErrorMessage name="cookTime" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <Label htmlFor="servings">Servings</Label>
                  <Field as={Input} name="servings" type="number" min="1" />
                  <ErrorMessage name="servings" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              {/* Ingredients */}
              <FieldArray name="ingredients">
                {({ push, remove }) => (
                  <div>
                    <Label>Ingredients</Label>
                    {values.ingredients.map((ingredient, idx) => (
                      <div key={idx} className="flex gap-2 mb-4">
                        <Field as={Input} name={`ingredients[${idx}].amount`} placeholder="Amount" />
                        <Field as={Input} name={`ingredients[${idx}].name`} placeholder="Ingredient" />
                        <Button
                          type="button"
                          onClick={() => remove(idx)}
                          disabled={values.ingredients.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => push({ name: "", amount: "" })}
                      className="mt-4"
                    >
                      Add Ingredient
                    </Button>
                    <ErrorMessage name="ingredients" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </FieldArray>
              {/* Instructions */}
              <FieldArray name="instructions">
                {({ push, remove }) => (
                  <div>
                    <Label>Instructions</Label>
                    {values.instructions.map((instruction, idx) => (
                      <div key={idx} className="flex gap-2 mb-4">
                        <Field as={Textarea} name={`instructions[${idx}]`} placeholder={`Step ${idx + 1}`} />
                        <Button
                          type="button"
                          onClick={() => remove(idx)}
                          disabled={values.instructions.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => push("")}
                      className="mt-4"
                    >
                      Add Step
                    </Button>
                    <ErrorMessage name="instructions" component="div" className="text-red-500 text-sm" />
                  </div>
                )}
              </FieldArray>
              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Field as={Input} name="tags" placeholder="e.g. dessert, vegan, quick" />
                <ErrorMessage name="tags" component="div" className="text-red-500 text-sm" />
              </div>
              {/* Image */}
              <div>
                <Label>Recipe Image</Label>
                <label htmlFor="image-upload" className="inline-block px-4 py-2 bg-recipe-primary text-white rounded cursor-pointer hover:bg-recipe-primary/90 m-4">
                  Select Image
                </label>
                <input
                  id="image-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    setFieldValue("image", e.currentTarget.files[0]);
                    if (e.currentTarget.files[0]) {
                      const reader = new FileReader();
                      reader.onloadend = () => setImagePreview(reader.result);
                      reader.readAsDataURL(e.currentTarget.files[0]);
                    } else {
                      setImagePreview(null);
                    }
                  }}
                />
                {values.image && (
                  <div className="bg-gray-100 px-3 py-1 rounded text-sm mt-2 inline-block">
                    {values.image.name}
                  </div>
                )}
                {imagePreview && (
                  <div className="w-full bg-gray-50 rounded mt-4 flex justify-center items-center border border-gray-200" style={{ minHeight: '200px' }}>
                    <img src={imagePreview} alt="Preview" className="w-full h-auto object-contain rounded" />
                  </div>
                )}
                <ErrorMessage name="image" component="div" className="text-red-500 text-sm" />
              </div>
              {/* Submit */}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Recipe"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </MainLayout>
  );
};

export default CreateRecipe;
