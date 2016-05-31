
<input type="button" id="add-pic" value="Add Pictures" class="btn btn-primary" />
<input id="num-per-row-spinner" name="num-per-row-spinner" value="1" type="hidden" />


<!--<div id="gallery_fm_dialog" class="modal fade" tabindex="-1" role="dialog">
   <div class="modal-dialog modal-lg">
      <div class="modal-content">
         <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
            <h4 class="modal-title">Add Picture/s</h4>
         </div>
         <div class="modal-body">
            <div id="elfinder_cont"></div>
         </div>
      </div>
   </div>
</div>-->


<div id="img-pos-dialog" class="modal fade" tabindex="-1" role="dialog">
   <div class="modal-dialog modal-sm">
      <div class="modal-content">
         <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
            <h4 class="modal-title">Change position</h4>
         </div>
         <div class="modal-body">
            <label for="new-idx">Choose new position:</label>
            <select id="new-idx">
               <!--<option value=""></option>-->
            </select>
            <input type="hidden" id="prev-idx" />
         </div>
      </div>
   </div>
</div>
