import json

class InstructionGenerator:
    def generate_instructions(self, input_data):
        instructions = {"steps": ["Step 1", "Step 2", "Step 3"], "summary": "Summary of the task"}
        with open("instructions.json", "w") as file:
            json.dump(instructions, file)
        return instructions
