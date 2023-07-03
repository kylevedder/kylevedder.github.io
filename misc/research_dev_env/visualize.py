import torch
import open3d as o3d

# Make a simple 2 layer MLP with ReLU activations
class MLP(torch.nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(MLP, self).__init__()
        self.fc1 = torch.nn.Linear(input_size, hidden_size)
        self.relu = torch.nn.ReLU()
        self.fc2 = torch.nn.Linear(hidden_size, output_size)

    def forward(self, x):
        hidden = self.fc1(x)
        relu = self.relu(hidden)
        output = self.fc2(relu)
        return output
    
# Create a model 
model = MLP(3, 64, 3).cuda().eval()


# Create an input point cloud
points = torch.randn(100, 3).cuda()
points = torch.nn.functional.normalize(points, dim=1)

# Run the model on the input

output = model(points)

# Visualize the input and output point clouds

input_pcd = o3d.geometry.PointCloud()
input_pcd.points = o3d.utility.Vector3dVector(points.cpu().numpy())
# Color the input point cloud red
input_pcd.paint_uniform_color([1, 0, 0])

output_pcd = o3d.geometry.PointCloud()
output_pcd.points = o3d.utility.Vector3dVector(output.detach().cpu().numpy())
# Color the output point cloud blue
output_pcd.paint_uniform_color([0, 0, 1])

o3d.visualization.draw_geometries([input_pcd, output_pcd])
