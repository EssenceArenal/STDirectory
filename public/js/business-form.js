// Santa Teresa Directory - Business Form JavaScript

// Form validation and submission
class BusinessForm {
    constructor() {
        this.form = document.getElementById('business-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.submitText = document.getElementById('submit-text');
        this.submitLoading = document.getElementById('submit-loading');
        
        this.initializeForm();
    }
    
    initializeForm() {
        if (!this.form) return;
        
        // Load categories
        this.loadCategories();
        
        // Set up form validation
        this.setupValidation();
        
        // Set up form submission
        this.setupSubmission();
        
        // Set up image upload
        this.setupImageUpload();
    }
    
    async loadCategories() {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            
            const categories = await response.json();
            this.populateCategorySelect(categories);
            
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showError('Failed to load categories');
        }
    }
    
    populateCategorySelect(categories) {
        const categorySelect = document.getElementById('category');
        if (!categorySelect) return;
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = `${category.icon || ''} ${category.name}`.trim();
            categorySelect.appendChild(option);
        });
    }
    
    setupValidation() {
        // Real-time validation for required fields
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                if (field.classList.contains('form-error')) {
                    this.validateField(field);
                }
            });
        });
        
        // Email validation
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('blur', () => {
                this.validateEmail(emailField);
            });
        }
        
        // Phone validation
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            phoneField.addEventListener('blur', () => {
                this.validatePhone(phoneField);
            });
        }
        
        // Website validation
        const websiteField = document.getElementById('website');
        if (websiteField) {
            websiteField.addEventListener('blur', () => {
                this.validateWebsite(websiteField);
            });
        }
        
        // Coordinates validation
        const latField = document.getElementById('latitude');
        const lngField = document.getElementById('longitude');
        
        if (latField) {
            latField.addEventListener('blur', () => {
                this.validateCoordinate(latField, 'latitude');
            });
        }
        
        if (lngField) {
            lngField.addEventListener('blur', () => {
                this.validateCoordinate(lngField, 'longitude');
            });
        }
    }
    
    setupSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateForm()) {
                this.showError('Please correct the errors below.');
                return;
            }
            
            await this.submitForm();
        });
    }
    
    setupImageUpload() {
        const imageInput = document.getElementById('image');
        if (!imageInput) return;
        
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.validateImage(file);
                this.previewImage(file);
            }
        });
        
        // Drag and drop functionality
        const dropZone = imageInput.closest('.border-dashed');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('border-ocean-blue', 'bg-blue-50');
            });
            
            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-ocean-blue', 'bg-blue-50');
            });
            
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-ocean-blue', 'bg-blue-50');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    imageInput.files = files;
                    this.validateImage(files[0]);
                    this.previewImage(files[0]);
                }
            });
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        
        if (field.type === 'text' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Must be at least 2 characters long.';
        }
        
        this.setFieldValidation(field, isValid, errorMessage);
        return isValid;
    }
    
    validateEmail(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
        
        this.setFieldValidation(field, isValid, errorMessage);
        return isValid;
    }
    
    validatePhone(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (value && !/^[\+]?[0-9\s\-\(\)]{8,}$/.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
        
        this.setFieldValidation(field, isValid, errorMessage);
        return isValid;
    }
    
    validateWebsite(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (value && !/^https?:\/\/.+\..+/.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid website URL (include http:// or https://).';
        }
        
        this.setFieldValidation(field, isValid, errorMessage);
        return isValid;
    }
    
    validateCoordinate(field, type) {
        const value = parseFloat(field.value);
        let isValid = true;
        let errorMessage = '';
        
        if (field.value && isNaN(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid number.';
        } else if (field.value) {
            if (type === 'latitude' && (value < -90 || value > 90)) {
                isValid = false;
                errorMessage = 'Latitude must be between -90 and 90.';
            } else if (type === 'longitude' && (value < -180 || value > 180)) {
                isValid = false;
                errorMessage = 'Longitude must be between -180 and 180.';
            }
        }
        
        this.setFieldValidation(field, isValid, errorMessage);
        return isValid;
    }
    
    validateImage(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        
        let isValid = true;
        let errorMessage = '';
        
        if (file.size > maxSize) {
            isValid = false;
            errorMessage = 'Image must be less than 5MB.';
        } else if (!allowedTypes.includes(file.type)) {
            isValid = false;
            errorMessage = 'Please select a valid image file (JPEG, PNG, or GIF).';
        }
        
        const imageInput = document.getElementById('image');
        this.setFieldValidation(imageInput, isValid, errorMessage);
        
        return isValid;
    }
    
    previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Create or update image preview
            let preview = document.getElementById('image-preview');
            if (!preview) {
                preview = document.createElement('div');
                preview.id = 'image-preview';
                preview.className = 'mt-4';
                document.getElementById('image').closest('.mt-6').appendChild(preview);
            }
            
            preview.innerHTML = `
                <div class="relative inline-block">
                    <img src="${e.target.result}" alt="Preview" class="w-32 h-32 object-cover rounded-lg shadow-md">
                    <button type="button" id="remove-image" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600">
                        ×
                    </button>
                </div>
            `;
            
            // Add remove functionality
            document.getElementById('remove-image').addEventListener('click', () => {
                document.getElementById('image').value = '';
                preview.remove();
            });
        };
        reader.readAsDataURL(file);
    }
    
    setFieldValidation(field, isValid, errorMessage) {
        // Remove existing error styling and messages
        field.classList.remove('form-error', 'form-success');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid) {
            field.classList.add('form-error');
            
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        } else if (field.value.trim()) {
            field.classList.add('form-success');
        }
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate optional fields that have values
        const emailField = document.getElementById('email');
        if (emailField && emailField.value.trim()) {
            if (!this.validateEmail(emailField)) isValid = false;
        }
        
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value.trim()) {
            if (!this.validatePhone(phoneField)) isValid = false;
        }
        
        const websiteField = document.getElementById('website');
        if (websiteField && websiteField.value.trim()) {
            if (!this.validateWebsite(websiteField)) isValid = false;
        }
        
        const latField = document.getElementById('latitude');
        if (latField && latField.value.trim()) {
            if (!this.validateCoordinate(latField, 'latitude')) isValid = false;
        }
        
        const lngField = document.getElementById('longitude');
        if (lngField && lngField.value.trim()) {
            if (!this.validateCoordinate(lngField, 'longitude')) isValid = false;
        }
        
        return isValid;
    }
    
    async submitForm() {
        try {
            this.setSubmitting(true);
            
            // Upload image first if present
            let imageUrl = null;
            const imageFile = document.getElementById('image').files[0];
            
            if (imageFile) {
                imageUrl = await this.uploadImage(imageFile);
            }
            
            // Prepare form data
            const formData = this.getFormData();
            if (imageUrl) {
                formData.image_url = imageUrl;
            }
            
            // Submit business data
            const response = await fetch('/api/businesses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add business');
            }
            
            const business = await response.json();
            this.showSuccess(`Business "${business.name}" has been added successfully!`);
            this.resetForm();
            
            // Redirect to business detail page after a delay
            setTimeout(() => {
                window.location.href = `/business/${business.id}`;
            }, 2000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showError(error.message || 'Failed to add business. Please try again.');
        } finally {
            this.setSubmitting(false);
        }
    }
    
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to upload image');
        }
        
        const result = await response.json();
        return result.imageUrl;
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (key !== 'image') { // Skip image file
                data[key] = value.trim() || null;
            }
        }
        
        // Convert numeric fields
        if (data.latitude) data.latitude = parseFloat(data.latitude);
        if (data.longitude) data.longitude = parseFloat(data.longitude);
        
        return data;
    }
    
    setSubmitting(isSubmitting) {
        this.submitBtn.disabled = isSubmitting;
        
        if (isSubmitting) {
            this.submitText.classList.add('hidden');
            this.submitLoading.classList.remove('hidden');
        } else {
            this.submitText.classList.remove('hidden');
            this.submitLoading.classList.add('hidden');
        }
    }
    
    showSuccess(message) {
        const successDiv = document.getElementById('success-message');
        const successText = document.getElementById('success-text');
        
        if (successDiv && successText) {
            successText.textContent = message;
            successDiv.classList.remove('hidden');
            
            // Hide error message if visible
            const errorDiv = document.getElementById('error-message');
            if (errorDiv) {
                errorDiv.classList.add('hidden');
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    showError(message) {
        const errorDiv = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        
        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.classList.remove('hidden');
            
            // Hide success message if visible
            const successDiv = document.getElementById('success-message');
            if (successDiv) {
                successDiv.classList.add('hidden');
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    resetForm() {
        this.form.reset();
        
        // Remove all validation styling
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('form-error', 'form-success');
        });
        
        // Remove error messages
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        // Remove image preview
        const preview = document.getElementById('image-preview');
        if (preview) {
            preview.remove();
        }
    }
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('business-form')) {
        window.businessForm = new BusinessForm();
    }
});

// Export for use in other scripts
window.BusinessForm = BusinessForm;