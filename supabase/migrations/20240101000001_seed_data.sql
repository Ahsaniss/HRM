-- Insert Departments
INSERT INTO public.departments (name, description) VALUES
  ('Engineering', 'Software development and IT operations'),
  ('Human Resources', 'HR, recruitment, and employee relations'),
  ('Sales', 'Sales and business development'),
  ('Marketing', 'Marketing and communications'),
  ('Finance', 'Accounting, finance, and payroll'),
  ('Operations', 'Business operations and logistics'),
  ('Customer Support', 'Customer service and support')
ON CONFLICT (name) DO NOTHING;

-- Insert Positions
INSERT INTO public.positions (title, description, min_salary, max_salary) VALUES
  ('Software Engineer', 'Develops and maintains software applications', 60000, 120000),
  ('Senior Software Engineer', 'Senior software developer with leadership responsibilities', 90000, 160000),
  ('HR Manager', 'Manages human resources operations', 55000, 95000),
  ('Sales Executive', 'Handles sales and client relationships', 45000, 85000),
  ('Marketing Specialist', 'Creates and executes marketing campaigns', 50000, 90000),
  ('Accountant', 'Manages financial records and reporting', 50000, 85000),
  ('Customer Support Representative', 'Provides customer service and support', 35000, 55000),
  ('Product Manager', 'Manages product development and strategy', 80000, 140000),
  ('DevOps Engineer', 'Manages infrastructure and deployment', 70000, 130000),
  ('Data Analyst', 'Analyzes data and creates insights', 60000, 110000)
ON CONFLICT (title) DO NOTHING;
